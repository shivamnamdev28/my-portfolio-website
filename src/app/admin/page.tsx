import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { type Database } from '@/lib/database.types';
import { portfolioApi, type Category, type Subcategory } from '@/lib/supabase';

// Component Imports
// Ensure this path is correct for your AdminDashboard component
import AdminDashboard from '@/components/admin/AdminDashboard';

export const revalidate = 0; // Ensures data is always fresh

export default async function AdminPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  // Fetch session data
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect unauthenticated users
  if (!session) {
    redirect('/login');
  }

  // Fetch categories and subcategories for the form
  // These are passed as initial props to the client component (AdminDashboard)
  const categories: Category[] = await portfolioApi.getCategories(); // Changed to getCategories
  const subcategories: Subcategory[] = await portfolioApi.getSubcategories(); // Changed to getSubcategories

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">Admin Dashboard</h1>
        {/* Pass initial data to the AdminDashboard component */}
        <AdminDashboard initialCategories={categories} initialSubcategories={subcategories} />
      </div>
    </div>
  );
}
