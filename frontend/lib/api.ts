export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Extract base URL without /api suffix for uploads
const BASE_URL = API_URL.replace(/\/api$/, '');

export const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return '/img/product-placeholder.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  return `${BASE_URL}${imagePath}`;
};
