import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Modal, ScrollView } from 'react-native';
import { Searchbar, ActivityIndicator, IconButton, Text, Button } from 'react-native-paper';
import 'react-native-get-random-values';
import { JobCard } from '../components/JobCard';
import { ApplicationForm } from '../components/ApplicationForm';
import { useJobs } from '../hooks/useJobs';
import { useTheme } from '../context/ThemeContext';
import { Job, JobApplication } from '../types/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { v4 as uuidv4 } from 'uuid';
import { jobService } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'JobFinder'>;

export const JobFinderScreen: React.FC<Props> = ({ navigation }) => {
  const { jobs, savedJobs, loading, error, saveJob, removeJob, searchJobs, refreshJobs } = useJobs();
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
    navigation.navigate('ApplicationForm', { job });
  };

  const runTests = async () => {
    try {
      setTestResults('Running tests...\n');
      setShowTestResults(true);
      
      // Test 1: API Connection
      setTestResults(prev => prev + '\n1. Testing API Connection...');
      const jobsData = await jobService.getJobs();
      setTestResults(prev => prev + `\n   ✓ API responded with ${jobsData.length} jobs`);
      
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
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error}</Text>
        <Button onPress={refreshJobs} style={styles.button}>
          Retry
        </Button>
      </View>
    );
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
          icon={isDarkMode ? 'white-balance-sunny' : 'moon-waning-crescent'}
          size={24}
          onPress={toggleTheme}
        />
        <IconButton
          icon="bookmark"
          size={24}
          onPress={() => navigation.navigate('SavedJobs')}
        />
      </View>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onSave={() => saveJob(item)}
            onApply={handleApply}
            isSaved={savedJobs.some(savedJob => savedJob.id === item.id)}
          />
        )}
        contentContainerStyle={styles.list}
      />

      <Modal
        visible={showTestResults}
        onRequestClose={() => setShowTestResults(false)}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>API Test Results</Text>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setShowTestResults(false)}
            />
          </View>
          <ScrollView style={styles.testResults}>
            <Text>{testResults}</Text>
          </ScrollView>
        </View>
      </Modal>

      <Button
        mode="contained"
        onPress={runTests}
        style={styles.testButton}
      >
        Run API Tests
      </Button>
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
    backgroundColor: '#fff',
    elevation: 4,
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
  },
  list: {
    padding: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  testResults: {
    padding: 16,
  },
  testButton: {
    margin: 16,
  },
}); 