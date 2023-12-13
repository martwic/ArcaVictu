/**
 * const SUPABASE_KEY = 'SUPABASE_CLIENT_API_KEY'
const SUPABASE_URL = "https://gqslyondgncsrrryejpi.supabase.co"
const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_KEY);

 */

import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gqslyondgncsrrryejpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxc2x5b25kZ25jc3JycnllanBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAyNDE2OTcsImV4cCI6MjAxNTgxNzY5N30.a3cfhpF7v-D4eW_C4LW_NMw6F9js3UyiwI4JU4kUIu4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/*
, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}
*/