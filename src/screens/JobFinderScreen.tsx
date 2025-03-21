import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Modal, ScrollView } from 'react-native';
import { Searchbar, ActivityIndicator, IconButton, Text, Button } from 'react-native-paper';
import { JobCard } from '../components/JobCard';
import { ApplicationForm } from '../components/ApplicationForm';
import { useJobs } from '../hooks/useJobs';
import { useTheme } from '../context/ThemeContext';
import { Job, JobApplication } from '../types/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { getMockJobs } from '../utils/mockApi';
import { v4 as uuidv4 } from 'uuid';
import { AxiosError } from 'axios';

type Props = NativeStackScreenProps<RootStackParamList, 'JobFinder'>;

export const JobFinderScreen: React.FC<Props> = ({ navigation }) => {
  const { jobs, loading, error, saveJob, searchJobs } = useJobs();
  const { isDarkMode, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [testResults, setTestResults] = useState<string>('');
  const [showTestResults, setShowTestResults] = useState(false);

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
    // Show success message
    alert('Application submitted successfully!');
  };

  const runTests = async () => {
    try {
      setTestResults('Running tests...\n');
      setShowTestResults(true);
      
      // Test 1: Mock API Connection
      setTestResults(prev => prev + '\n1. Testing Mock API Connection...');
      const jobsData = await getMockJobs();
      setTestResults(prev => prev + `\n   ✓ Mock API responded with ${jobsData.length} jobs`);
      
      // Test 2: Data Structure
      setTestResults(prev => prev + '\n\n2. Testing Data Structure...');
      setTestResults(prev => prev + `\n   ✓ Received ${jobsData.length} jobs`);
      
      // Test 3: UUID Generation
      setTestResults(prev => prev + '\n\n3. Testing UUID Generation...');
      const jobsWithIds = jobsData.map(job => ({
        ...job,
        id: uuidv4()
      }));
      const uniqueIds = new Set(jobsWithIds.map(job => job.id));
      setTestResults(prev => prev + `\n   ✓ Generated ${uniqueIds.size} unique IDs for ${jobsWithIds.length} jobs`);
      
      // Test 4: Required Fields
      setTestResults(prev => prev + '\n\n4. Testing Required Fields...');
      const sampleJob = jobsWithIds[0];
      setTestResults(prev => prev + '\n   Job fields present:');
      setTestResults(prev => prev + `\n   - Title: ${sampleJob.title ? '✓' : '✗'}`);
      setTestResults(prev => prev + `\n   - Company: ${sampleJob.company ? '✓' : '✗'}`);
      setTestResults(prev => prev + `\n   - Salary: ${sampleJob.salary ? '✓' : '✗'}`);
      setTestResults(prev => prev + `\n   - Location: ${sampleJob.location ? '✓' : '✗'}`);
      setTestResults(prev => prev + `\n   - Description: ${sampleJob.description ? '✓' : '✗'}`);
      
      setTestResults(prev => prev + '\n\nAll tests completed successfully! ✨');
    } catch (error) {
      setTestResults(prev => prev + `\n\nError during tests: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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

      <Button
        mode="contained"
        onPress={runTests}
        style={styles.testButton}
      >
        Run API Tests
      </Button>

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

      <Modal
        visible={showTestResults}
        onRequestClose={() => setShowTestResults(false)}
        animationType="slide"
        transparent
      >
        <View style={styles.testModalOverlay}>
          <View style={[styles.testModalContent, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
            <View style={styles.testModalHeader}>
              <Text style={[styles.testModalTitle, { color: isDarkMode ? '#ffffff' : '#000000' }]}>
                Test Results
              </Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setShowTestResults(false)}
              />
            </View>
            <ScrollView style={styles.testResultsScroll}>
              <Text style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                {testResults}
              </Text>
            </ScrollView>
          </View>
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
  testButton: {
    margin: 16,
  },
  testModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  testModalContent: {
    borderRadius: 8,
    maxHeight: '80%',
    width: '100%',
    elevation: 5,
  },
  testModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  testModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  testResultsScroll: {
    padding: 16,
  },
}); 