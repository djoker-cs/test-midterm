import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Job } from '../types/types';
import { getMockJobs } from '../utils/mockApi';

// Ensure crypto polyfill is available for Android
if (Platform.OS === 'android') {
  require('react-native-get-random-values');
}

const API_URL = 'https://empllo.com/api/v1';

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
    loadSavedJobs();
  }, []);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from real API first
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('API request failed');
        }
        const data = await response.json();
        setJobs(data);
      } catch (apiError) {
        // If API fails, fall back to mock data
        console.log('API failed, using mock data:', apiError);
        const mockJobs = await getMockJobs();
        const jobsWithIds = mockJobs.map(job => ({
          ...job,
          id: uuidv4(),
          isSaved: false
        }));
        setJobs(jobsWithIds);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, []);

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

  const saveJob = useCallback(async (job: Job) => {
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
  }, [jobs, savedJobs]);

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

  const searchJobs = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from real API first
      try {
        const response = await fetch(`${API_URL}?search=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('API request failed');
        }
        const data = await response.json();
        setJobs(data);
      } catch (apiError) {
        // If API fails, fall back to mock data
        console.log('API failed, using mock data:', apiError);
        const mockJobs = await getMockJobs();
        const jobsWithIds = mockJobs
          .filter(job => 
            job.title.toLowerCase().includes(query.toLowerCase()) ||
            job.company.toLowerCase().includes(query.toLowerCase()) ||
            job.location.toLowerCase().includes(query.toLowerCase())
          )
          .map(job => ({
            ...job,
            id: uuidv4(),
            isSaved: false
          }));
        setJobs(jobsWithIds);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    jobs,
    savedJobs,
    loading,
    error,
    fetchJobs,
    loadSavedJobs,
    saveJob,
    removeJob,
    searchJobs
  };
}; 