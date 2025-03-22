import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { Job, JobApplication } from '../types/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { jobService } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'ApplicationForm'>;

export const ApplicationForm: React.FC<Props> = ({ route, navigation }) => {
  const { job, fromSavedJobs } = route.params;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    whyHireYou: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    contactNumber: '',
    whyHireYou: '',
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      contactNumber: '',
      whyHireYou: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!validatePhone(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid phone number';
    }

    if (!formData.whyHireYou.trim()) {
      newErrors.whyHireYou = 'This field is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await jobService.applyForJob(job.id, {
          ...formData,
          jobId: job.id,
        });
        alert('Application submitted successfully!');
        if (fromSavedJobs) {
          navigation.navigate('JobFinder');
        } else {
          navigation.goBack();
        }
      } catch (error) {
        alert('Failed to submit application. Please try again.');
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Apply for {job.title}</Text>
      <Text style={styles.subtitle}>{job.company}</Text>

      <TextInput
        label="Full Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        style={styles.input}
        error={!!errors.name}
      />
      <HelperText type="error" visible={!!errors.name}>
        {errors.name}
      </HelperText>

      <TextInput
        label="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        error={!!errors.email}
      />
      <HelperText type="error" visible={!!errors.email}>
        {errors.email}
      </HelperText>

      <TextInput
        label="Contact Number"
        value={formData.contactNumber}
        onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
        keyboardType="phone-pad"
        style={styles.input}
        error={!!errors.contactNumber}
      />
      <HelperText type="error" visible={!!errors.contactNumber}>
        {errors.contactNumber}
      </HelperText>

      <TextInput
        label="Why should we hire you?"
        value={formData.whyHireYou}
        onChangeText={(text) => setFormData({ ...formData, whyHireYou: text })}
        multiline
        numberOfLines={4}
        style={styles.input}
        error={!!errors.whyHireYou}
      />
      <HelperText type="error" visible={!!errors.whyHireYou}>
        {errors.whyHireYou}
      </HelperText>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
        >
          Submit Application
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  input: {
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
}); 