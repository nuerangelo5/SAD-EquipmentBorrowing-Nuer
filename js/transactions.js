// Borrowing Transaction functions

async function getAllTransactions() {
  const { data, error } = await sb
    .from('borrow_transactions')
    .select(`
      *,
      equipment:equipment_id (
        equipment_name,
        asset_code,
        category
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Apply overdue detection (BR-09)
  const today = new Date().toISOString().split('T')[0];
  return (data || []).map(tx => {
    if (tx.status !== 'Returned' && tx.due_date < today) {
      tx.status = 'Overdue';
    }
    return tx;
  });
}

async function recordBorrowing(transaction) {
  // BR-04: Borrower name must be provided
  if (!transaction.borrower_name || transaction.borrower_name.trim() === '') {
    throw new Error('Borrower name is required.');
  }
  
  // BR-05: Due date cannot be earlier than borrowing date
  if (transaction.due_date < transaction.date_borrowed) {
    throw new Error('Due date cannot be earlier than the borrowing date.');
  }
  
  // BR-03: Only available equipment may be borrowed
  const { data: equip } = await sb
    .from('equipment')
    .select('availability')
    .eq('id', transaction.equipment_id)
    .single();
  
  if (!equip || equip.availability !== 'Available') {
    throw new Error('Only available equipment may be borrowed.');
  }
  
  const user = await getCurrentUser();
  
  // Insert transaction (BR-06: status = Borrowed)
  const { data, error } = await sb
    .from('borrow_transactions')
    .insert([{
      equipment_id: transaction.equipment_id,
      borrower_name: transaction.borrower_name.trim(),
      borrower_type: transaction.borrower_type,
      department: transaction.department.trim(),
      date_borrowed: transaction.date_borrowed,
      due_date: transaction.due_date,
      status: 'Borrowed',
      user_id: user?.id
    }])
    .select();
  
  if (error) throw error;
  
  // BR-07: Borrowed equipment becomes unavailable
  await sb
    .from('equipment')
    .update({ availability: 'Borrowed' })
    .eq('id', transaction.equipment_id);
  
  return data[0];
}

async function returnEquipment(transactionId, equipmentId) {
  // BR-12: A returned transaction cannot be returned a second time
  const { data: tx } = await sb
    .from('borrow_transactions')
    .select('status')
    .eq('id', transactionId)
    .single();
  
  if (tx && tx.status === 'Returned') {
    throw new Error('This transaction has already been returned.');
  }
  
  const today = new Date().toISOString().split('T')[0];
  
  // Update transaction
  const { error: txError } = await sb
    .from('borrow_transactions')
    .update({
      date_returned: today,
      status: 'Returned'
    })
    .eq('id', transactionId);
  
  if (txError) throw txError;
  
  // BR-08: Returned equipment becomes available again
  const { error: eqError } = await sb
    .from('equipment')
    .update({ availability: 'Available' })
    .eq('id', equipmentId);
  
  if (eqError) throw eqError;
}

async function searchTransactions(query) {
  const { data, error } = await sb
    .from('borrow_transactions')
    .select(`
      *,
      equipment:equipment_id (
        equipment_name,
        asset_code,
        category
      )
    `)
    .or(`borrower_name.ilike.%${query}%`)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  const today = new Date().toISOString().split('T')[0];
  return (data || []).map(tx => {
    if (tx.status !== 'Returned' && tx.due_date < today) {
      tx.status = 'Overdue';
    }
    return tx;
  });
}

async function getDashboardStats() {
  const equipment = await getAllEquipment();
  const transactions = await getAllTransactions();
  
  const total = equipment.length;
  const available = equipment.filter(e => e.availability === 'Available').length;
  const borrowed = equipment.filter(e => e.availability === 'Borrowed').length;
  const returned = transactions.filter(t => t.status === 'Returned').length;
  const overdue = transactions.filter(t => t.status === 'Overdue').length;
  
  return { total, available, borrowed, returned, overdue };
}
