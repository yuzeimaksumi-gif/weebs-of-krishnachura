// Prices are stored in paise (100 paise = 1 rupee). This turns them into text.
export function formatPaise(paise: number): string {
  if (paise === 0) return 'Free'
  return (paise / 100).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: paise % 100 === 0 ? 0 : 2,
  })
}