import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Job } from '../types/types';

// Ensure crypto polyfill is available for Android
if (Platform.OS === 'android') {
  require('react-native-get-random-values');
}

const tryFetch = async (url:'https://empllo.com/api/v1') => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch data' 
    };
  }
};

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
      const response = await fetch('https://empllo.com/api/v1');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const jobsWithIds = data.map((job: Omit<Job, 'id'>) => ({
        ...job,
        id: uuidv4(),
        isSaved: false
      }));
      setJobs(jobsWithIds);
    } catch (err) {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedJobs = async () => {
    try {
      const saved = await AsyncStorage.getItem('@savedJobs');
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
      await AsyncStorage.setItem('@savedJobs', JSON.stringify(updatedSavedJobs));
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
      await AsyncStorage.setItem('@savedJobs', JSON.stringify(updatedSavedJobs));
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