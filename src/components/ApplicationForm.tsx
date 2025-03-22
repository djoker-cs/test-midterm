import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { JobApplication, ValidationError } from '../types/types';

interface ApplicationFormProps {
  jobId: string;
  onSubmit: (application: JobApplication) => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ jobId, onSubmit }) => {
  const [formData, setFormData] = useState<JobApplication>({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    jobId: jobId
  });

  const [errors, setErrors] = useState<ValidationError>({
    name: '',
    email: '',
    phone: '',
    coverLetter: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
      isValid = false;
    }

    // Philippine mobile number validation
    const phoneRegex = /^(09|\+639)\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid Philippine mobile number';
      isValid = false;
    }

    // Cover letter validation
    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'This field is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        name: '',
        email: '',
        phone: '',
        coverLetter: '',
        jobId: jobId
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        error={!!errors.name}
      />
      <HelperText type="error" visible={!!errors.name}>
        {errors.name}
      </HelperText>

      <TextInput
        label="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        error={!!errors.email}
      />
      <HelperText type="error" visible={!!errors.email}>
        {errors.email}
      </HelperText>

      <TextInput
        label="Contact Number"
        value={formData.phone}
        onChangeText={(text) => setFormData({ ...formData, phone: text })}
        error={!!errors.phone}
        placeholder="+63 912 345 6789"
      />
      <HelperText type="error" visible={!!errors.phone}>
        {errors.phone}
      </HelperText>

      <TextInput
        label="Cover Letter"
        value={formData.coverLetter}
        onChangeText={(text) => setFormData({ ...formData, coverLetter: text })}
        error={!!errors.coverLetter}
        multiline
        numberOfLines={4}
      />
      <HelperText type="error" visible={!!errors.coverLetter}>
        {errors.coverLetter}
      </HelperText>

      <Button mode="contained" onPress={handleSubmit}>
        Submit Application
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
}); 