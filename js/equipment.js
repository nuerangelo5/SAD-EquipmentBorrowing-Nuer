// Equipment CRUD functions

async function getAllEquipment() {
  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

async function addEquipment(equipment) {
  // BR-01: Equipment name cannot be empty
  if (!equipment.equipment_name || equipment.equipment_name.trim() === '') {
    throw new Error('Equipment name cannot be empty.');
  }
  
  // BR-02: Asset code must be unique (handled by database unique constraint)
  const { data, error } = await supabase
    .from('equipment')
    .insert([{
      equipment_name: equipment.equipment_name.trim(),
      category: equipment.category,
      asset_code: equipment.asset_code.trim().toUpperCase(),
      condition: equipment.condition || 'Good',
      availability: 'Available'
    }])
    .select();
  
  if (error) {
    if (error.code === '23505') {
      throw new Error('Asset code already exists. Please use a unique asset code.');
    }
    throw error;
  }
  return data[0];
}

async function updateEquipment(id, updates) {
  if (!updates.equipment_name || updates.equipment_name.trim() === '') {
    throw new Error('Equipment name cannot be empty.');
  }
  
  const { data, error } = await supabase
    .from('equipment')
    .update({
      equipment_name: updates.equipment_name.trim(),
      category: updates.category,
      asset_code: updates.asset_code.trim().toUpperCase(),
      condition: updates.condition
    })
    .eq('id', id)
    .select();
  
  if (error) {
    if (error.code === '23505') {
      throw new Error('Asset code already exists.');
    }
    throw error;
  }
  return data[0];
}

async function deleteEquipment(id) {
  // BR-10: Deletion requires confirmation (handled in UI)
  const { error } = await supabase
    .from('equipment')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

async function getAvailableEquipment() {
  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .eq('availability', 'Available')
    .order('equipment_name');
  
  if (error) throw error;
  return data || [];
}

async function searchEquipment(query) {
  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .or(`equipment_name.ilike.%${query}%,asset_code.ilike.%${query}%`)
    .order('equipment_name');
  
  if (error) throw error;
  return data || [];
}
