import { createClient } from '@supabase/supabase-js'


const supabaseUrl = "https://pxhmxgotbfwypaqwpcmh.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4aG14Z290YmZ3eXBhcXdwY21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NjU2MjAsImV4cCI6MjA3MjE0MTYyMH0.Yu2C0MZ-f4EaFGeJ03YmDtT7m539Q84JfqULqwe2XUI"
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export  default supabase

    