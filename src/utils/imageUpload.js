import axios from 'axios';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

/**
 * Upload image to ImgBB
 * @param {File|string} image - File object or base64 string
 * @returns {Promise<string>} - Image URL
 */
export const uploadImage = async (image) => {
  try {
    const formData = new FormData();
    
    if (typeof image === 'string') {
      // Base64 string
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      formData.append('image', base64Data);
    } else {
      // File object
      formData.append('image', image);
    }
    
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      formData
    );
    
    if (response.data.success) {
      return response.data.data.url;
    }
    
    throw new Error('Image upload failed');
  } catch (error) {
    console.error('ImgBB Upload Error:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Convert file to base64
 * @param {File} file - File object
 * @returns {Promise<string>} - Base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Validate image file
 * @param {File} file - File object
 * @param {number} maxSizeMB - Maximum file size in MB
 * @returns {object} - Validation result
 */
export const validateImage = (file, maxSizeMB = 5) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
  
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }
  
  if (!validTypes.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type. Please upload JPEG, PNG, GIF, or WebP' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }
  
  return { isValid: true };
};

export default {
  uploadImage,
  fileToBase64,
  validateImage
};
