import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Modal, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JobCard } from '../components/JobCard';
import { ApplicationForm } from '../components/ApplicationForm';
import { useJobs } from '../hooks/useJobs';
import { Job, JobApplication, RootStackParamList } from '../types/types';

export const SavedJobsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { savedJobs, removeJob } = useJobs();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleApplicationSubmit = (application: JobApplication) => {
    console.log('Application submitted:', application);
    setShowModal(false);
    setSelectedJob(null);
    navigation.navigate('JobFinder');
  };

  if (savedJobs.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No saved jobs yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={savedJobs}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onApply={handleApply}
            onRemove={removeJob}
            showRemoveButton
          />
        )}
        keyExtractor={item => item.id}
      />

      <Portal>
        <Modal
          visible={showModal}
          onDismiss={() => setShowModal(false)}
          contentContainerStyle={styles.modal}
        >
          {selectedJob && (
            <ApplicationForm
              jobId={selectedJob.id}
              onSubmit={handleApplicationSubmit}
            />
          )}
        </Modal>
      </Portal>
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
  modal: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
}); 