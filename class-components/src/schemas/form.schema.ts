import { z } from 'zod';
import { validateEmail } from '../utils/formHelpers';

export const createFormSchema = (allowedCountries: string[]) =>
  z
    .object({
      name: z
        .string()
        .min(1, 'Name is required')
        .refine(
          (val) => val.length > 0 && val.startsWith(val[0].toUpperCase()),
          'First letter must be uppercase'
        ),

      age: z
        .number()
        .nonnegative('Age cannot be negative')
        .or(z.nan())
        .refine((val) => !Number.isNaN(val), 'Age must be a number'),

      email: z
        .string()
        .min(1, 'Email is required')
        .refine(validateEmail, 'Invalid email structure (no regex allowed)'),

      gender: z
        .string()
        .min(1, 'Please select your gender')
        .refine(
          (val) => ['male', 'female', 'other'].includes(val),
          'Please select your gender'
        ),

      country: z
        .string()
        .refine(
          (val) => allowedCountries.includes(val),
          'Country must exist in database'
        ),

      password: z.string().min(6, 'Password must be at least 6 characters'),
      confirmPassword: z.string().min(1, 'Confirm your password'),

      image: z
        .any()
        .refine((files) => files && files.length > 0, 'Image is required')
        .refine(
          (files) =>
            files?.[0] && ['image/jpeg', 'image/png'].includes(files[0].type),
          'Only JPG/PNG supported'
        )
        .refine(
          (files) => files?.[0] && files[0].size <= 2 * 1024 * 1024,
          'Max size is 2MB'
        ),

      acceptedTerms: z
        .boolean()
        .refine((val) => val === true, 'You must accept the terms'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });

export type FormFieldsData = z.infer<ReturnType<typeof createFormSchema>>;
