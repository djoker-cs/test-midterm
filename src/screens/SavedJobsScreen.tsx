import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { JobCard } from '../components/JobCard';
import { ApplicationForm } from '../components/ApplicationForm';
import { useJobs } from '../hooks/useJobs';
import { Job, ApplicationForm as ApplicationFormType } from '../types/types';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export const SavedJobsScreen = () => {
  const { savedJobs, removeJob } = useJobs();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();

  const handleApply = (job: Job) => {
    setSelectedJob(job);
  };

  const handleSubmitApplication = (form: ApplicationFormType) => {
    // In a real app, you would send this to an API
    console.log('Application submitted:', form);
    setSelectedJob(null);
    // Navigate back to JobFinder after successful application
    navigation.navigate('JobFinder' as never);
  };

  if (savedJobs.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: isDarkMode ? '#121212' : '#f0f0f0' }]}>
        <Text style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
          No saved jobs yet
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f0f0f0' }]}>
      <FlatList
        data={savedJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onRemove={removeJob}
            onApply={handleApply}
            showRemoveButton
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
          fromSavedJobs
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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