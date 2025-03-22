import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Modal } from 'react-native';
import { Searchbar, ActivityIndicator, IconButton, Text } from 'react-native-paper';
import { JobCard } from '../components/JobCard';
import { ApplicationForm } from '../components/ApplicationForm';
import { useJobs } from '../hooks/useJobs';
import { useTheme } from '../context/ThemeContext';
import { Job, JobApplication } from '../types/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'JobFinder'>;

export const JobFinderScreen: React.FC<Props> = ({ navigation }) => {
  const { jobs, loading, error, saveJob, searchJobs } = useJobs();
  const { isDarkMode, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchJobs(query);
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = (application: JobApplication) => {
    // In a real app, you would send this to an API
    console.log('Application submitted:', application);
    setShowApplicationForm(false);
    setSelectedJob(null);
    alert('Application submitted successfully!');
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search jobs..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
        <IconButton
          icon={isDarkMode ? 'white-balance-sunny' : 'moon-waning-crescent'}
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
        keyExtractor={(item) => item.id}
      />

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
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