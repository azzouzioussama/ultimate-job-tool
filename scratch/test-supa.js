const { createClient } = require('@supabase/supabase-js');
try {
  createClient('', '');
} catch(e) {
  console.log("ERROR:", e.message);
}
