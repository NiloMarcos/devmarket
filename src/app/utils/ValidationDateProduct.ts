export function isExpired(date: string) {
  const today = new Date();
  const expirationDate = new Date(date);
  return expirationDate < today;
};

export function isManufactureAfterExpiration(manufactureDate: string, expirationDate: string) {
  if (!manufactureDate || !expirationDate) return false;
  const manufacture = new Date(manufactureDate);
  const expiration = new Date(expirationDate);
  return manufacture > expiration;
};
