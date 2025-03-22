import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { JobApplication } from '../types/types';

interface ApplicationFormProps {
  jobId: string;
  onSubmit: (application: JobApplication) => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  jobId,
  onSubmit,
}) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState<JobApplication>({
    name: '',
    email: '',
    contactNumber: '',
    whyHireYou: '',
    jobId: jobId,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof JobApplication, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof JobApplication, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else {
      // Philippine mobile number validation
      // Format: +63 XXX XXX XXXX or 09XX XXX XXXX
      const phoneRegex = /^(\+63|0)([9]\d{9})$/;
      const cleanNumber = formData.contactNumber.replace(/\s+/g, '');
      if (!phoneRegex.test(cleanNumber)) {
        newErrors.contactNumber = 'Invalid Philippine mobile number format (e.g., +63 912 345 6789 or 0912 345 6789)';
      }
    }

    if (!formData.whyHireYou.trim()) {
      newErrors.whyHireYou = 'Please tell us why we should hire you';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPhoneNumber = (number: string) => {
    // Remove all non-digit characters
    const cleaned = number.replace(/\D/g, '');
    
    // Format the number
    if (cleaned.startsWith('63')) {
      return `+${cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4')}`;
    } else if (cleaned.startsWith('0')) {
      return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
    }
    return number;
  };

  const handlePhoneChange = (text: string) => {
    const formattedNumber = formatPhoneNumber(text);
    setFormData({ ...formData, contactNumber: formattedNumber });
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        name: '',
        email: '',
        contactNumber: '',
        whyHireYou: '',
        jobId: jobId,
      });
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }
      ]}
    >
      <TextInput
        label="Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        mode="outlined"
        error={!!errors.name}
        style={styles.input}
      />
      {errors.name && (
        <HelperText type="error" visible={!!errors.name}>
          {errors.name}
        </HelperText>
      )}

      <TextInput
        label="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        mode="outlined"
        error={!!errors.email}
        style={styles.input}
        keyboardType="email-address"
      />
      {errors.email && (
        <HelperText type="error" visible={!!errors.email}>
          {errors.email}
        </HelperText>
      )}

      <TextInput
        label="Contact Number"
        value={formData.contactNumber}
        onChangeText={handlePhoneChange}
        mode="outlined"
        error={!!errors.contactNumber}
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="+63 XXX XXX XXXX or 09XX XXX XXXX"
      />
      {errors.contactNumber && (
        <HelperText type="error" visible={!!errors.contactNumber}>
          {errors.contactNumber}
        </HelperText>
      )}

      <TextInput
        label="Why should we hire you?"
        value={formData.whyHireYou}
        onChangeText={(text) => setFormData({ ...formData, whyHireYou: text })}
        mode="outlined"
        error={!!errors.whyHireYou}
        style={styles.input}
        multiline
        numberOfLines={4}
      />
      {errors.whyHireYou && (
        <HelperText type="error" visible={!!errors.whyHireYou}>
          {errors.whyHireYou}
        </HelperText>
      )}

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.button}
      >
        Submit Application
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  }
}); 