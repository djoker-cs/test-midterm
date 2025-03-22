import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Modal } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { JobCard } from '../components/JobCard';
import { ApplicationForm } from '../components/ApplicationForm';
import { useJobs } from '../hooks/useJobs';
import { useTheme } from '../context/ThemeContext';
import { Job, JobApplication } from '../types/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'SavedJobs'>;

export const SavedJobsScreen: React.FC<Props> = ({ navigation }) => {
  const { savedJobs, removeJob } = useJobs();
  const { isDarkMode } = useTheme();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = (application: JobApplication) => {
    // In a real app, you would send this to an API
    console.log('Application submitted:', application);
    setShowApplicationForm(false);
    setSelectedJob(null);
    // Show success message and navigate back
    alert('Application submitted successfully!');
    navigation.navigate('JobFinder');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
      {savedJobs.length === 0 ? (
        <View style={styles.centered}>
          <Text>No saved jobs yet</Text>
        </View>
      ) : (
        <FlatList
          data={savedJobs}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onSave={() => {}}
              onApply={handleApply}
              onRemove={removeJob}
              showRemoveButton
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}

      <Modal
        visible={showApplicationForm}
        onRequestClose={() => setShowApplicationForm(false)}
        animationType="slide"
      >
        <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
          <IconButton
            icon="close"
            size={24}
            onPress={() => setShowApplicationForm(false)}
            style={styles.closeButton}
          />
          {selectedJob && (
            <ApplicationForm
              jobId={selectedJob.id}
              onSubmit={handleApplicationSubmit}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    padding: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
}); 