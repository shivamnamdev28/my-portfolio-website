-- Create editable_texts table for dynamic content management
CREATE TABLE public.editable_texts (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.editable_texts ENABLE ROW LEVEL SECURITY;

-- Create policies for editable texts (admin can manage, public can read)
CREATE POLICY "Allow public read access to editable_texts" 
ON public.editable_texts 
FOR SELECT 
USING (true);

CREATE POLICY "Allow admin all access to editable_texts" 
ON public.editable_texts 
FOR ALL 
USING (true);

-- Create resumes table for resume management
CREATE TABLE public.resumes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Create policies for resumes
CREATE POLICY "Allow public read access to resumes" 
ON public.resumes 
FOR SELECT 
USING (true);

CREATE POLICY "Allow admin all access to resumes" 
ON public.resumes 
FOR ALL 
USING (true);

-- Add missing columns to portfolio_items
ALTER TABLE public.portfolio_items 
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS file_urls TEXT[],
ADD COLUMN IF NOT EXISTS project_type TEXT,
ADD COLUMN IF NOT EXISTS sector TEXT;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for portfolio bucket
CREATE POLICY "Allow public read access to portfolio files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'portfolio');

CREATE POLICY "Allow admin upload to portfolio" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Allow admin delete from portfolio" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'portfolio');

-- Create storage policies for resumes bucket  
CREATE POLICY "Allow public read access to resume files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resumes');

CREATE POLICY "Allow admin upload to resumes" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Allow admin delete from resumes" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'resumes');

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_editable_texts_updated_at
  BEFORE UPDATE ON public.editable_texts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();