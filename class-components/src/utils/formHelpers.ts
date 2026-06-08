export const validateMinimalEmail = (email: string): boolean => {
  if (!email) return false;
  const atParts = email.split('@');
  if (atParts.length !== 2) return false;

  const [localPart, domainPart] = atParts;
  if (!localPart || !domainPart) return false;

  const dotParts = domainPart.split('.');
  if (dotParts.length < 2) return false;

  return dotParts.every((part) => part.length > 0);
};

export interface PasswordStrength {
  hasNumber: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasSpecial: boolean;
  score: number;
}

export const checkPasswordStrength = (password: string): PasswordStrength => {
  const status = {
    hasNumber: /d/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(status).filter(Boolean).length;
  return { ...status, score };
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
