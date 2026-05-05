export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string {
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Enter a valid email address";
  return "";
}

/**
 * Full password validation — used on signup and change-password forms.
 * Must match the backend signupSchema rules exactly.
 */
export function validatePassword(password: string): string {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character (e.g. !@#$%)";
  return "";
}

/**
 * Lightweight password check — used on the sign-in form only.
 * We don't validate complexity on sign-in; just ensure the field isn't empty.
 */
export function validateSignInPassword(password: string): string {
  if (!password) return "Password is required";
  return "";
}

export function validateName(name: string): string {
  if (!name) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  return "";
}

export function validateConfirmPassword(password: string, confirmPassword: string): string {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
}
