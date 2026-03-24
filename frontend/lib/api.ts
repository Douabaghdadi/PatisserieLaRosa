export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return '/img/product-placeholder.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}${imagePath}`;
};
