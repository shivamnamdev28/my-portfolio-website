-- Create portfolio categories table
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create portfolio subcategories table
CREATE TABLE public.subcategories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create portfolio items table
CREATE TABLE public.portfolio_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create enquiries table
CREATE TABLE public.enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access for portfolio data
CREATE POLICY "Allow public read access to categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to subcategories" ON public.subcategories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to portfolio items" ON public.portfolio_items FOR SELECT USING (true);

-- Allow insert for enquiries (public contact form)
CREATE POLICY "Allow public insert to enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);

-- Create admin policies (will work when authentication is implemented)
CREATE POLICY "Allow admin all access to categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Allow admin all access to subcategories" ON public.subcategories FOR ALL USING (true);
CREATE POLICY "Allow admin all access to portfolio items" ON public.portfolio_items FOR ALL USING (true);
CREATE POLICY "Allow admin read access to enquiries" ON public.enquiries FOR SELECT USING (true);

-- Insert some sample data
INSERT INTO public.categories (name, description) VALUES 
('Brand Design', 'Logo and brand identity projects'),
('Video Production', 'Video content creation and editing'),
('Social Media', 'Social media content and management');

INSERT INTO public.subcategories (name, description, category_id) VALUES 
('Logo Design', 'Custom logo creation', (SELECT id FROM public.categories WHERE name = 'Brand Design')),
('Brand Identity', 'Complete brand identity packages', (SELECT id FROM public.categories WHERE name = 'Brand Design')),
('Promotional Videos', 'Marketing and promotional content', (SELECT id FROM public.categories WHERE name = 'Video Production'));

INSERT INTO public.portfolio_items (title, description, category_id, subcategory_id, image_url, featured, order_index) VALUES 
('Modern Tech Logo', 'Clean and modern logo design for tech startup', 
 (SELECT id FROM public.categories WHERE name = 'Brand Design'),
 (SELECT id FROM public.subcategories WHERE name = 'Logo Design'),
 '/placeholder.svg', true, 1),
('Complete Brand Package', 'Full brand identity including logo, colors, and guidelines',
 (SELECT id FROM public.categories WHERE name = 'Brand Design'),
 (SELECT id FROM public.subcategories WHERE name = 'Brand Identity'),
 '/placeholder.svg', true, 2);