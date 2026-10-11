// Booking reference like WOK-7K2M9QXA.
// The alphabet skips look-alike characters (I, L, O, 0, 1).
// The reference is only a lookup key. Looking up an order also needs the buyer's email.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export function makeBookingRef(): string {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  let out = ''
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length]
  return `WOK-${out}`
}