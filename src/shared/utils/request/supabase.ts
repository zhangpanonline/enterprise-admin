// Qfucav8DzeCowPcT
// pnpx supabase gen types typescript --project-id smmexdymolziqxyrvctw > database.types.ts
import { createClient } from '@supabase/supabase-js'
// import { type Database } from '@/shared/types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

