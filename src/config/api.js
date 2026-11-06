/**
 * API configuration helper.
 * When deploying frontend separately (e.g. Vercel, Netlify),
 * configure VITE_API_BASE_URL in your hosting dashboard (e.g. https://your-backend.onrender.com).
 * In local development, leaving it empty uses the Vite proxy (/api).
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const apiUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};
