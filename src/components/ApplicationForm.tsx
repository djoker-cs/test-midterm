import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Title, Portal, Modal, Text } from 'react-native-paper';
import { Job, ApplicationForm as ApplicationFormType } from '../types/types';
import { useTheme } from '../context/ThemeContext';

interface ApplicationFormProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (form: ApplicationFormType) => void;
  job: Job;
  fromSavedJobs?: boolean;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  visible,
  onDismiss,
  onSubmit,
  job,
  fromSavedJobs = false,
}) => {
  const { isDarkMode } = useTheme();
  const [form, setForm] = useState<ApplicationFormType>({
    name: '',
    email: '',
    contactNumber: '',
    whyHireYou: '',
    jobId: job.id,
  });
  const [errors, setErrors] = useState<Partial<ApplicationFormType>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<ApplicationFormType> = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!form.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(form.contactNumber.replace(/\D/g, ''))) {
      newErrors.contactNumber = 'Invalid contact number (10 digits required)';
    }
    
    if (!form.whyHireYou.trim()) {
      newErrors.whyHireYou = 'Please tell us why we should hire you';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(form);
      setForm({
        name: '',
        email: '',
        contactNumber: '',
        whyHireYou: '',
        jobId: job.id,
      });
      setShowSuccess(true);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onDismiss();
  };

  return (
    <Portal>
      {showSuccess ? (
        <Modal
          visible={showSuccess}
          onDismiss={handleSuccessClose}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }
          ]}
        >
          <Title style={{ color: isDarkMode ? '#ffffff' : '#000000', marginBottom: 20 }}>
            Application Submitted!
          </Title>
          <Text style={{ color: isDarkMode ? '#e0e0e0' : '#333333', marginBottom: 20 }}>
            Your application has been submitted successfully.
          </Text>
          <Button mode="contained" onPress={handleSuccessClose}>
            Okay
          </Button>
        </Modal>
      ) : (
        <Modal
          visible={visible}
          onDismiss={onDismiss}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }
          ]}
        >
          <ScrollView>
            <Title style={{ color: isDarkMode ? '#ffffff' : '#000000', marginBottom: 20 }}>
              Apply for {job.title}
            </Title>
            
            <TextInput
              label="Name"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              error={!!errors.name}
              style={styles.input}
              mode="outlined"
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}
            
            <TextInput
              label="Email"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              error={!!errors.email}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            
            <TextInput
              label="Contact Number"
              value={form.contactNumber}
              onChangeText={(text) => setForm({ ...form, contactNumber: text })}
              error={!!errors.contactNumber}
              style={styles.input}
              mode="outlined"
              keyboardType="phone-pad"
            />
            {errors.contactNumber && (
              <Text style={styles.errorText}>{errors.contactNumber}</Text>
            )}
            
            <TextInput
              label="Why should we hire you?"
              value={form.whyHireYou}
              onChangeText={(text) => setForm({ ...form, whyHireYou: text })}
              error={!!errors.whyHireYou}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={4}
            />
            {errors.whyHireYou && (
              <Text style={styles.errorText}>{errors.whyHireYou}</Text>
            )}
            
            <View style={styles.buttonContainer}>
              <Button onPress={onDismiss} style={styles.button}>
                Cancel
              </Button>
              <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                Submit
              </Button>
            </View>
          </ScrollView>
        </Modal>
      )}
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    padding: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  input: {
    marginBottom: 4,
  },
  errorText: {
    color: '#cf6679',
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    marginLeft: 8,
  },
}); 