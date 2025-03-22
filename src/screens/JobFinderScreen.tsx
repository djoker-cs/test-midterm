import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Searchbar, ActivityIndicator, Text, IconButton, Modal, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JobCard } from '../components/JobCard';
import { ApplicationForm } from '../components/ApplicationForm';
import { useJobs } from '../hooks/useJobs';
import { useTheme } from '../context/ThemeContext';
import { Job, JobApplication, RootStackParamList } from '../types/types';

export const JobFinderScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { jobs, loading, error, saveJob, searchJobs } = useJobs();
  const { toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchJobs(query);
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleApplicationSubmit = (application: JobApplication) => {
    console.log('Application submitted:', application);
    setShowModal(false);
    setSelectedJob(null);
  };

  useEffect(() => {
    console.log('Current jobs:', jobs);
    console.log('Loading state:', loading);
    console.log('Error state:', error);
  }, [jobs, loading, error]);

  if (loading) {
    return <ActivityIndicator style={styles.centered} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search jobs..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
        <IconButton
          icon="theme-light-dark"
          onPress={toggleTheme}
        />
      </View>

      <FlatList
        data={jobs}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onSave={saveJob}
            onApply={handleApply}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  searchBar: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    textAlign: 'center',
    margin: 16,
    color: 'red',
  },
  modal: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
}); 