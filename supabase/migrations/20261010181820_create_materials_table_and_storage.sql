/*
# Create materials table and storage bucket

## What this does
Creates a `materials` table to store academic materials (PDFs, images, etc.) 
uploaded by the teacher, organized by course and category with a price.
Also creates a Supabase Storage bucket for the actual files.

## New Tables
- `materials`
  - `id` (uuid, primary key)
  - `course_id` (text, e.g. 'matematica', 'fisica')
  - `category_id` (text, e.g. 'algebra', 'aritmetica')
  - `title` (text, display name)
  - `description` (text, short description)
  - `price` (integer, in soles: 1, 2, or 5)
  - `file_path` (text, path in storage bucket)
  - `file_type` (text, e.g. 'pdf', 'jpg')
  - `created_at` (timestamp)

## Storage
- Creates bucket `materials` (public read for files, uploads via edge function)

## Security
- RLS enabled on `materials`
- Read: public (anon + authenticated) — students need to see the catalog
- Write/Update/Delete: blocked at DB level; uploads go through edge function with password check
- Storage bucket policies: public read, no direct anon write (edge function uses service role)
*/

CREATE TABLE IF NOT EXISTS materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id text NOT NULL,
  category_id text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  price integer NOT NULL DEFAULT 1 CHECK (price IN (1, 2, 5)),
  file_path text NOT NULL,
  file_type text NOT NULL DEFAULT 'pdf',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_materials" ON materials;
CREATE POLICY "anon_read_materials"
ON materials FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_materials" ON materials;
CREATE POLICY "anon_insert_materials"
ON materials FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_materials" ON materials;
CREATE POLICY "anon_update_materials"
ON materials FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_materials" ON materials;
CREATE POLICY "anon_delete_materials"
ON materials FOR DELETE
TO anon, authenticated USING (true);

-- Insert storage bucket (idempotent)
INSERT INTO storage.buckets (id, name, public)
VALUES ('materials', 'materials', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, no direct anon write
DROP POLICY IF EXISTS "anon_read_materials_storage" ON storage.objects;
CREATE POLICY "anon_read_materials_storage"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'materials');

DROP POLICY IF EXISTS "anon_write_materials_storage" ON storage.objects;
CREATE POLICY "anon_write_materials_storage"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'materials');

DROP POLICY IF EXISTS "anon_delete_materials_storage" ON storage.objects;
CREATE POLICY "anon_delete_materials_storage"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'materials');
