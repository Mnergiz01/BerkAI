/**
 * Format a number as currency (Turkish Lira)
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(amount);
}

/**
 * Format a date string to a readable format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format a date string to a short format
 * @param dateString - ISO date string
 * @returns Short formatted date string
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Format a date string with time
 * @param dateString - ISO date string
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Truncate text to a specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Get fallback image URL based on product name
 * @param productName - Name of the product
 * @returns Fallback image URL from Unsplash
 */
export function getFallbackImage(productName: string): string {
  const name = productName.toLowerCase();
  if (name.includes('elbise')) return 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800';
  if (name.includes('bluz')) return 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=800';
  if (name.includes('pantolon') || name.includes('jean')) return 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800';
  if (name.includes('etek')) return 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800';
  if (name.includes('ceket')) return 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800';
  if (name.includes('ayakkabı')) return 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800';
  if (name.includes('t-shirt') || name.includes('tshirt')) return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800';
  if (name.includes('gömlek')) return 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800';
  if (name.includes('kazak')) return 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800';
  if (name.includes('çanta')) return 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800';
  if (name.includes('saat')) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800';
  if (name.includes('gözlük')) return 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800';
  return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800'; // Default fashion image
}

/**
 * Get product image with fallback
 * @param imageUrl - Product image URL (may be empty or invalid)
 * @param productName - Name of the product for fallback
 * @returns Valid image URL (either original or fallback)
 */
export function getProductImage(imageUrl: string | undefined | null, productName: string): string {
  return imageUrl || getFallbackImage(productName);
}
