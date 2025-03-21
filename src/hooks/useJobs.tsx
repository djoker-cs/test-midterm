import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Job } from '../types/types';

// Ensure crypto polyfill is available for Android
if (Platform.OS === 'android') {
  require('react-native-get-random-values');
}

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
    loadSavedJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      console.log('Fetching jobs from:', 'https://empllo.com/api/v1');
      
      const response = await axios.get('https://empllo.com/api/v1');
      console.log('API Response Status:', response.status);
      console.log('API Response Headers:', response.headers);
      console.log('API Raw Response Data:', response.data);

      // Validate response data
      if (!response.data) {
        throw new Error('No data received from API');
      }

      // Ensure we handle both array and object responses
      const jobsData = Array.isArray(response.data) ? response.data : [response.data];
      console.log('Parsed jobs data length:', jobsData.length);
      
      const jobsWithIds = jobsData.map((job: Omit<Job, 'id'>, index: number) => {
        // Log detailed information about each job
        console.log(`Processing job ${index + 1}:`, {
          receivedTitle: job.title,
          receivedCompany: job.company,
          receivedSalary: job.salary,
          receivedLocation: job.location,
          receivedDescription: job.description
        });
        
        const processedJob = {
          ...job,
          // Ensure all required fields are present, use placeholders if missing
          title: job.title || 'No Title',
          company: job.company || 'No Company',
          salary: job.salary || 'Not Specified',
          location: job.location || 'Not Specified',
          description: job.description || 'No Description',
          // Generate a unique ID using uuid
          id: uuidv4(),
          isSaved: false
        };

        console.log(`Processed job ${index + 1}:`, processedJob);
        return processedJob;
      });

      console.log('Final processed jobs:', {
        totalJobs: jobsWithIds.length,
        sampleJob: jobsWithIds[0],
        allJobIds: jobsWithIds.map(job => job.id)
      });

      // Verify no duplicate IDs were generated
      const uniqueIds = new Set(jobsWithIds.map(job => job.id));
      if (uniqueIds.size !== jobsWithIds.length) {
        throw new Error('Duplicate IDs detected in processed jobs');
      }

      setJobs(jobsWithIds);
      setLoading(false);
    } catch (err) {
      const error = err as Error | AxiosError;
      console.error('API Error Details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        isAxiosError: axios.isAxiosError(error),
        status: axios.isAxiosError(error) ? error.response?.status : undefined,
        responseData: axios.isAxiosError(error) ? error.response?.data : undefined
      });
      
      setError(axios.isAxiosError(error) 
        ? `Failed to fetch jobs: ${error.response?.status} ${error.response?.statusText}`
        : 'Failed to fetch jobs: Network error');
      setLoading(false);
    }
  };

  const loadSavedJobs = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedJobs');
      if (saved) {
        setSavedJobs(JSON.parse(saved));
      }
    } catch (err) {
      setError('Failed to load saved jobs');
    }
  };

  const saveJob = async (job: Job) => {
    try {
      const updatedSavedJobs = [...savedJobs, { ...job, isSaved: true }];
      await AsyncStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
      setSavedJobs(updatedSavedJobs);
      
      const updatedJobs = jobs.map(j => 
        j.id === job.id ? { ...j, isSaved: true } : j
      );
      setJobs(updatedJobs);
    } catch (err) {
      setError('Failed to save job');
    }
  };

  const removeJob = async (jobId: string) => {
    try {
      const updatedSavedJobs = savedJobs.filter(job => job.id !== jobId);
      await AsyncStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
      setSavedJobs(updatedSavedJobs);
      
      const updatedJobs = jobs.map(j => 
        j.id === jobId ? { ...j, isSaved: false } : j
      );
      setJobs(updatedJobs);
    } catch (err) {
      setError('Failed to remove job');
    }
  };

  const searchJobs = (query: string) => {
    if (!query.trim()) {
      fetchJobs();
      return;
    }
    
    const filteredJobs = jobs.filter(job => 
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase()) ||
      job.location.toLowerCase().includes(query.toLowerCase())
    );
    setJobs(filteredJobs);
  };

  return {
    jobs,
    savedJobs,
    loading,
    error,
    saveJob,
    removeJob,
    searchJobs
  };
}; 