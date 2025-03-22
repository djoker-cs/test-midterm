import { JobApplication, ValidationError } from '../types/types';

export const validateApplication = (data: JobApplication): ValidationError => {
  const errors: ValidationError = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = 'Invalid email format';
    }
  }

  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else {
    const phoneRegex = /^(\+63|0)[9]\d{9}$/;
    const cleanNumber = data.phone.replace(/\s+/g, '');
    if (!phoneRegex.test(cleanNumber)) {
      errors.phone = 'Invalid Philippine mobile number format (e.g., +63 912 345 6789 or 0912 345 6789)';
    }
  }

  if (!data.coverLetter.trim()) {
    errors.coverLetter = 'Cover letter is required';
  }

  return errors;
}; 