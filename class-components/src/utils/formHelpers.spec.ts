import { describe, it, expect, vi } from 'vitest';
import {
  validateEmail,
  checkPasswordStrength,
  convertFileToBase64,
} from './formHelpers';

describe('formHelpers Unit Tests', () => {
  describe('validateEmail', () => {
    it('returns true for valid email structures', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('first.last@domain.co.uk')).toBe(true);
    });

    it('returns false for missing @ symbol', () => {
      expect(validateEmail('invalidEmail.com')).toBe(false);
    });

    it('returns false for multiple @ symbols', () => {
      expect(validateEmail('test@@example.com')).toBe(false);
    });

    it('returns false for missing local part or domain segment', () => {
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });

    it('returns false for domains missing dots', () => {
      expect(validateEmail('test@localhost')).toBe(false);
    });

    it('returns false for trailing or duplicate dots inside domain', () => {
      expect(validateEmail('test@domain.')).toBe(false);
      expect(validateEmail('test@domain..com')).toBe(false);
    });
  });

  describe('checkPasswordStrength', () => {
    it('identifies independent character types accurately', () => {
      expect(checkPasswordStrength('abc').hasLower).toBe(true);
      expect(checkPasswordStrength('ABC').hasUpper).toBe(true);
      expect(checkPasswordStrength('123').hasNumber).toBe(true);
      expect(checkPasswordStrength('!@#').hasSpecial).toBe(true);
    });

    it('calculates explicit scaling scores from 0 to 4', () => {
      expect(checkPasswordStrength('').score).toBe(0);
      expect(checkPasswordStrength('abcABC').score).toBe(2);
      expect(checkPasswordStrength('abcABC123!').score).toBe(4);
    });
  });

  describe('convertFileToBase64', () => {
    it('resolves a base64 string layout when FileReader loads successfully', async () => {
      const mockFile = new File(['mock content'], 'test.png', {
        type: 'image/png',
      });
      const result = await convertFileToBase64(mockFile);

      expect(result).toContain('data:image/png;base64');
      expect(typeof result).toBe('string');
    })
  });
});
