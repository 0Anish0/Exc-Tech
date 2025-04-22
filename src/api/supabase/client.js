import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL='https://qceesndfweuqkwdhaiwl.supabase.co'
const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZWVzbmRmd2V1cWt3ZGhhaXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MzY4ODAsImV4cCI6MjA2MDIxMjg4MH0.P0Ky0NbBfrAqbMRNB3nMuqgObbzBEHwu1T0Ax0X_0Z8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);