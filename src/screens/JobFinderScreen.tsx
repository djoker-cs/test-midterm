import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Searchbar, ActivityIndicator, Text } from 'react-native-paper';
import { JobCard } from '../components/JobCard';
import { ApplicationForm } from '../components/ApplicationForm';
import { useJobs } from '../hooks/useJobs';
import { Job, ApplicationForm as ApplicationFormType } from '../types';
import { useTheme } from '../context/ThemeContext';

export const JobFinderScreen = () => {
  const { jobs, loading, error, saveJob } = useJobs();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { isDarkMode } = useTheme();

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApply = (job: Job) => {
    setSelectedJob(job);
  };

  const handleSubmitApplication = (form: ApplicationFormType) => {
    // In a real app, you would send this to an API
    console.log('Application submitted:', form);
    setSelectedJob(null);
    // Show success message
    alert('Application submitted successfully!');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDarkMode ? '#121212' : '#f0f0f0' }
    ]}>
      <Searchbar
        placeholder="Search jobs..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onSave={saveJob}
            onApply={handleApply}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      {selectedJob && (
        <ApplicationForm
          visible={!!selectedJob}
          onDismiss={() => setSelectedJob(null)}
          onSubmit={handleSubmitApplication}
          job={selectedJob}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 16,
  },
  listContent: {
    padding: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 