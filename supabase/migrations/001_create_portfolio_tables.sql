-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subcategories table
CREATE TABLE subcategories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, category_id)
);

-- Create portfolio_items table
CREATE TABLE portfolio_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  image_url TEXT,
  video_url TEXT,
  file_urls TEXT[], -- Array for multiple files
  project_type VARCHAR(100),
  sector VARCHAR(100),
  featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
  ('Visual Design', 'Static design projects including graphics, branding, and print materials'),
  ('Video Showcase', 'Video content including promotional videos, films, and motion graphics'),
  ('Identity Design', 'Brand identity work including logos, brand themes, and corporate materials');

-- Insert default subcategories
INSERT INTO subcategories (name, description, category_id) VALUES
  ('Educational', 'Educational institution projects', (SELECT id FROM categories WHERE name = 'Visual Design')),
  ('Events', 'Event branding and promotional materials', (SELECT id FROM categories WHERE name = 'Visual Design')),
  ('Hospital', 'Healthcare and medical facility branding', (SELECT id FROM categories WHERE name = 'Visual Design')),
  ('Jewellery', 'Luxury jewelry and product showcases', (SELECT id FROM categories WHERE name = 'Visual Design')),
  ('Political', 'Political campaign materials and branding', (SELECT id FROM categories WHERE name = 'Visual Design')),
  ('Real Estate', 'Property marketing and real estate branding', (SELECT id FROM categories WHERE name = 'Visual Design')),
  ('Wedding', 'Wedding and pre-wedding design materials', (SELECT id FROM categories WHERE name = 'Visual Design')),
  ('Restaurant', 'Food & beverage branding and menus', (SELECT id FROM categories WHERE name = 'Visual Design')),
  
  ('Educational Videos', 'Educational content and training videos', (SELECT id FROM categories WHERE name = 'Video Showcase')),
  ('Event Videos', 'Event coverage and promotional videos', (SELECT id FROM categories WHERE name = 'Video Showcase')),
  ('Hospital Videos', 'Healthcare awareness and promotional content', (SELECT id FROM categories WHERE name = 'Video Showcase')),
  ('Hotel Videos', 'Hospitality and tourism promotional content', (SELECT id FROM categories WHERE name = 'Video Showcase')),
  ('Real Estate Videos', 'Property tours and real estate marketing', (SELECT id FROM categories WHERE name = 'Video Showcase')),
  ('Wedding Films', 'Wedding and pre-wedding cinematography', (SELECT id FROM categories WHERE name = 'Video Showcase')),
  ('Political Videos', 'Campaign videos and political content', (SELECT id FROM categories WHERE name = 'Video Showcase')),
  
  ('Logo Design', 'Custom logo design and brand marks', (SELECT id FROM categories WHERE name = 'Identity Design')),
  ('Brand Identity', 'Complete brand identity systems', (SELECT id FROM categories WHERE name = 'Identity Design')),
  ('Business Cards', 'Professional business card designs', (SELECT id FROM categories WHERE name = 'Identity Design')),
  ('Logo Animation', 'Animated logos and motion branding', (SELECT id FROM categories WHERE name = 'Identity Design'));

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Subcategories are viewable by everyone" ON subcategories FOR SELECT USING (true);
CREATE POLICY "Portfolio items are viewable by everyone" ON portfolio_items FOR SELECT USING (true);

-- Create policies for authenticated users to manage content
CREATE POLICY "Authenticated users can manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage subcategories" ON subcategories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage portfolio items" ON portfolio_items FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subcategories_updated_at BEFORE UPDATE ON subcategories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON portfolio_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create enquiries table
CREATE TABLE enquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create editable_texts table
CREATE TABLE editable_texts (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for new tables
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE editable_texts ENABLE ROW LEVEL SECURITY;

-- Create policies for enquiries (authenticated users can view/manage)
CREATE POLICY "Authenticated users can view enquiries" ON enquiries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Anyone can insert enquiries" ON enquiries FOR INSERT WITH CHECK (true);

-- Create policies for editable texts
CREATE POLICY "Everyone can view editable texts" ON editable_texts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage editable texts" ON editable_texts FOR ALL USING (auth.role() = 'authenticated');

-- Create resumes table for resume management
CREATE TABLE IF NOT EXISTS resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for resumes table
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Create policies for resumes
CREATE POLICY "Everyone can view active resumes" ON resumes FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage resumes" ON resumes FOR ALL USING (auth.role() = 'authenticated');

-- Create admin_users table for simple authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user (username: admin, password: admin123)
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (username) DO NOTHING;