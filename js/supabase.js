// Supabase Configuration
const SUPABASE_URL = 'https://yadngzrqrphohonzznki.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhZG5nenJxcnBob2hvbnp6bmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4OTYyODQsImV4cCI6MjEwNDQ3MjI4NH0.6A0iOO-0-2ukE36R2AiSMQXqm8t5dPqUm_v1SppL2qg';

// Initialize Supabase client
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
