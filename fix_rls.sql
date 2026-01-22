-- 1. Reset RLS on Projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access" ON projects;
DROP POLICY IF EXISTS "Allow authenticated insert" ON projects;
DROP POLICY IF EXISTS "Allow authenticated update" ON projects;
DROP POLICY IF EXISTS "Allow authenticated delete" ON projects;

-- Re-create Policies
CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON projects FOR DELETE TO authenticated USING (true);

-- 2. Reset RLS on Categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON categories;

CREATE POLICY "Allow public read access" ON categories FOR SELECT USING (true);

-- 3. Verify
SELECT count(*) as projects_count FROM projects;
