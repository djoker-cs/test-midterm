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

  if (!application.contactNumber.trim()) {
    errors.contactNumber = 'Contact number is required';
  } else if (!/^\+?[\d\s-]{10,}$/.test(application.contactNumber)) {
    errors.contactNumber = 'Invalid contact number';
  }

  if (!application.whyHireYou.trim()) {
    errors.whyHireYou = 'Please tell us why we should hire you';
  } else if (application.whyHireYou.length < 50) {
    errors.whyHireYou = 'Please provide at least 50 characters';
  }

  return errors;
}; 