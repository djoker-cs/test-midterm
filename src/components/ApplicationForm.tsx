import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { JobApplication } from '../types/types';
import { ValidationError, validateApplication } from '../utils/validation';

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
    phone: '',
    coverLetter: '',
    jobId: jobId,
  });
  const [errors, setErrors] = useState<ValidationError>({});

  const validateForm = (): boolean => {
    const validationErrors = validateApplication(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const formatPhoneNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.startsWith('63')) {
      return `+${cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4')}`;
    } else if (cleaned.startsWith('0')) {
      return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
    }
    return number;
  };

  const handlePhoneChange = (text: string) => {
    const formattedNumber = formatPhoneNumber(text);
    setFormData({ ...formData, phone: formattedNumber });
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        name: '',
        email: '',
        phone: '',
        coverLetter: '',
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
        label="Phone Number"
        value={formData.phone}
        onChangeText={handlePhoneChange}
        mode="outlined"
        error={!!errors.phone}
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="+63 XXX XXX XXXX or 09XX XXX XXXX"
      />
      {errors.phone && (
        <HelperText type="error" visible={!!errors.phone}>
          {errors.phone}
        </HelperText>
      )}

      <TextInput
        label="Cover Letter"
        value={formData.coverLetter}
        onChangeText={(text) => setFormData({ ...formData, coverLetter: text })}
        mode="outlined"
        error={!!errors.coverLetter}
        style={styles.input}
        multiline
        numberOfLines={4}
      />
      {errors.coverLetter && (
        <HelperText type="error" visible={!!errors.coverLetter}>
          {errors.coverLetter}
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