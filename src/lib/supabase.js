import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://hdgpeamwfnzwyilvjazq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkZ3BlYW13Zm56d3lpbHZqYXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0OTk5MDQsImV4cCI6MjA0NTA3NTkwNH0.HzNeKed33txVK-uoqK21MIRhuCwVw7GT_HmosLzp8o0')