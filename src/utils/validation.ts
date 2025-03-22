import { JobApplication, ValidationError } from '../types/types';

export const validateApplication = (application: JobApplication): ValidationError => {
  const errors: ValidationError = {};

  if (!application.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!application.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.email)) {
    errors.email = 'Invalid email format';
  }

  if (!application.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^\+?[\d\s-]{10,}$/.test(application.phone)) {
    errors.phone = 'Invalid phone number';
  }

  if (!application.coverLetter.trim()) {
    errors.coverLetter = 'Cover letter is required';
  } else if (application.coverLetter.length < 50) {
    errors.coverLetter = 'Cover letter must be at least 50 characters';
  }

  return errors;
}; 