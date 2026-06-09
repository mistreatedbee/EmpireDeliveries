export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidSAPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return (
    (digits.startsWith('27') && digits.length === 11) ||
    (digits.startsWith('0') && digits.length === 10)
  );
}

export function normalizeSAPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 10) return `+27${digits.slice(1)}`;
  if (digits.startsWith('27') && digits.length === 11) return `+${digits}`;
  return phone;
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function passwordStrength(password: string): 'weak' | 'medium' | 'strong' {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);
  const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  if (password.length < 8 || score < 2) return 'weak';
  if (score < 3) return 'medium';
  return 'strong';
}
