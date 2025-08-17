// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Load environment variables directly from Vite's import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log the values being used for debugging in the browser console
console.log("Supabase Client Init: VITE_SUPABASE_URL =", supabaseUrl);
console.log("Supabase Client Init: VITE_SUPABASE_ANON_KEY =", supabaseAnonKey ? supabaseAnonKey.substring(0, 10) + '...' : 'undefined'); // Log partial key for security

// Ensure that environment variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is not defined. Please check your .env file in the project root.');
}

// Create the Supabase client instance once when the module is loaded.
// This ensures a single, fully initialized client is available throughout the app.
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };

// Define types for portfolio data based on the existing Portfolio.tsx
export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subcategory {
  id: string;
  name: string;
  description: string | null;
  category_id: string;
  created_at: string;
  updated_at: string;
  category?: Category; // Optional, for joins
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category_id: string;
  subcategory_id: string | null;
  image_url: string | null;
  video_url: string | null;
  file_urls: string[] | null;
  project_type: string | null;
  sector: string | null;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  category?: Category; // Optional, for joins
  subcategory?: Subcategory; // Optional, for joins
}

export interface Enquiry {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  message: string;
  created_at: string;
}

export interface Resume {
  id: string;
  filename: string;
  file_url: string;
  is_active: boolean;
  uploaded_by: string | null; // Assuming auth.users(id) is a string UUID
  created_at: string;
  updated_at: string;
}

export interface EditableText {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}


export const portfolioApi = {
  // Categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (error) throw error;
    return data as Category[];
  },

  async createCategory(name: string, description?: string): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, description }])
      .select()
      .single();
    if (error) throw error;
    return data as Category;
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Category;
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Subcategories
  async getSubcategories(): Promise<Subcategory[]> {
    const { data, error } = await supabase
      .from('subcategories')
      .select('*, category:categories(name)') // Join with categories to get category name
      .order('name');
    if (error) throw error;
    return data.map(item => ({
      ...item,
      category: item.category || undefined // Ensure category is optional if not found
    })) as Subcategory[];
  },

  async createSubcategory(name: string, categoryId: string, description?: string): Promise<Subcategory> {
    const { data, error } = await supabase
      .from('subcategories')
      .insert([{ name, category_id: categoryId, description }])
      .select('*, category:categories(name)')
      .single();
    if (error) throw error;
    return { ...data, category: data.category || undefined } as Subcategory;
  },

  async updateSubcategory(id: string, updates: Partial<Subcategory>): Promise<Subcategory> {
    const { data, error } = await supabase
      .from('subcategories')
      .update(updates)
      .eq('id', id)
      .select('*, category:categories(name)')
      .single();
    if (error) throw error;
    return { ...data, category: data.category || undefined } as Subcategory;
  },

  async deleteSubcategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('subcategories')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Portfolio Items
  async getPortfolioItems(): Promise<PortfolioItem[]> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select(`
        *,
        category:categories(name),
        subcategory:subcategories(name)
      `)
      .order('order_index', { ascending: true });
    if (error) throw error;
    return data.map(item => ({
      ...item,
      category: item.category || undefined,
      subcategory: item.subcategory || undefined
    })) as PortfolioItem[];
  },

  async createPortfolioItem(item: Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at' | 'category' | 'subcategory'>): Promise<PortfolioItem> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert([item])
      .select(`
        *,
        category:categories(name),
        subcategory:subcategories(name)
      `)
      .single();
    if (error) throw error;
    return { ...data, category: data.category || undefined, subcategory: data.subcategory || undefined } as PortfolioItem;
  },

  async updatePortfolioItem(id: string, updates: Partial<PortfolioItem>): Promise<PortfolioItem> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        category:categories(name),
        subcategory:subcategories(name)
      `)
      .single();
    if (error) throw error;
    return { ...data, category: data.category || undefined, subcategory: data.subcategory || undefined } as PortfolioItem;
  },

  async deletePortfolioItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Enquiries
  async getEnquiries(): Promise<Enquiry[]> {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Enquiry[];
  },

  // Resumes
  async getResumes(): Promise<Resume[]> {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Resume[];
  },

  async createResume(filename: string, file_url: string, is_active: boolean): Promise<Resume> {
    const { data, error } = await supabase
      .from('resumes')
      .insert([{ filename, file_url, is_active }])
      .select()
      .single();
    if (error) throw error;
    return data as Resume;
  },

  async updateResume(id: string, updates: Partial<Resume>): Promise<Resume> {
    const { data, error } = await supabase
      .from('resumes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Resume;
  },

  async deleteResume(id: string): Promise<void> {
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Editable Texts
  async getEditableText(id: string): Promise<EditableText | null> {
    const { data, error } = await supabase
      .from('editable_texts')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 means no rows found
    return data as EditableText | null;
  },

  async updateEditableText(id: string, content: string): Promise<EditableText> {
    const { data, error } = await supabase
      .from('editable_texts')
      .upsert({ id, content }, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw error;
    return data as EditableText;
  },
};
