export function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(price);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function getDiscountPercentage(
  price: number,
  discountPrice: number
): number {
  return Math.round(((price - discountPrice) / price) * 100);
}
