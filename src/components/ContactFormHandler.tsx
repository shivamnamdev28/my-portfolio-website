import { supabase } from "@/integrations/supabase/client";

export const submitEnquiry = async (formData: {
  name: string;
  email?: string;
  phone: string;
  message: string;
}) => {
  try {
    // Save to database
    const { error } = await supabase
      .from('enquiries')
      .insert([{
        name: formData.name,
        phone: formData.phone,
        message: formData.message
      }]);

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    // Also try to send email as backup
    try {
      const response = await fetch('https://formspree.io/f/xpznrkzp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
          _subject: 'New Enquiry from Website'
        })
      });
    } catch (emailError) {
      console.log('Email service not available, but enquiry saved to database');
    }

    return { success: true, message: 'Enquiry submitted successfully!' };
  } catch (error) {
    console.error('Submission error:', error);
    return { success: false, message: 'Failed to submit enquiry. Please try again.' };
  }
};