import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
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
    } else if (!/^\d{10}$/.test(formData.contactNumber.replace(/\D/g, ''))) {
      newErrors.contactNumber = 'Invalid contact number format';
    }

    if (!formData.whyHireYou.trim()) {
      newErrors.whyHireYou = 'Please tell us why we should hire you';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        <Text style={styles.errorText}>{errors.name}</Text>
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
        <Text style={styles.errorText}>{errors.email}</Text>
      )}

      <TextInput
        label="Contact Number"
        value={formData.contactNumber}
        onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
        mode="outlined"
        error={!!errors.contactNumber}
        style={styles.input}
        keyboardType="phone-pad"
      />
      {errors.contactNumber && (
        <Text style={styles.errorText}>{errors.contactNumber}</Text>
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
        <Text style={styles.errorText}>{errors.whyHireYou}</Text>
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
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginBottom: 8,
  },
}); 