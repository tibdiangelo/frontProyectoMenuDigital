const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://sqecyoriqvpodsyrylzi.supabase.co';
const supabaseKey = 'sb_publishable_z58jR4O6fZFOzgVyoBpb8g_c19W6IZR'

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };