const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2tpeXVqZGduc3Z4Y2tndnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4ODE3NjAsImV4cCI6MjA1NjQ1Nzc2MH0.iaF4gBheqxy3QeT5189cLaY6asvvUwjXTXIwq0csAvI";
const SUPABASE_URL = "https://wxkkiyujdgnsvxckgvyq.supabase.co";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
