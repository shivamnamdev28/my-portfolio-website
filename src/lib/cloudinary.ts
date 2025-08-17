// src/lib/cloudinary.ts

// IMPORTANT: Load Cloudinary Cloud Name and Upload Preset from environment variables
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: 'image' | 'video' | 'raw';
}

/**
 * Uploads a file (image or video) directly to Cloudinary using an unsigned upload preset.
 * @param file The File object to upload.
 * @returns A promise that resolves with the secure URL of the uploaded file.
 */
export const uploadFileToCloudinary = async (file: File): Promise<string> => {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error("VITE_CLOUDINARY_CLOUD_NAME is not defined in your .env file or environment.");
  }
  if (!CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("VITE_CLOUDINARY_UPLOAD_PRESET is not defined in your .env file or environment.");
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to upload file to Cloudinary');
    }

    const data: CloudinaryUploadResult = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Note on Deletion:
 * Direct client-side deletion of assets from Cloudinary using unsigned presets is not secure
 * as it would require exposing your Cloudinary API Secret.
 * For production applications, deletion should always be handled via a secure backend API
 * that uses your Cloudinary API Key and Secret to sign deletion requests.
 *
 * For this "easy option", when a portfolio item is deleted, its URL will simply be removed
 * from your Supabase database. The actual asset on Cloudinary will remain unless you
 * manually delete it from your Cloudinary dashboard.
 * If you need automated deletion, you would need to implement a small backend service
 * (e.g., a Supabase Edge Function, AWS Lambda, or a simple Node.js endpoint on Hostinger)
 * that handles signed deletion requests.
 */
