import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Job } from '../types/types';
import { jobService } from '../services/api';

// Ensure crypto polyfill is available for Android
if (Platform.OS === 'android') {
  require('react-native-get-random-values');
}

interface UseJobsReturn {
  jobs: Job[];
  savedJobs: Job[];
  loading: boolean;
  error: string | null;
  saveJob: (job: Job) => void;
  removeJob: (jobId: string) => void;
  searchJobs: (query: string) => Promise<void>;
  refreshJobs: () => Promise<void>;
}

export const useJobs = (): UseJobsReturn => {
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
      const jobsData = await jobService.getJobs();
      const jobsWithIds = jobsData.map((job) => ({
        ...job,
        id: uuidv4(),
        isSaved: false
      }));
      setJobs(jobsWithIds);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch jobs');
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

  const searchJobs = async (query: string) => {
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

  const refreshJobs = async () => {
    await fetchJobs();
  };

  return {
    jobs,
    savedJobs,
    loading,
    error,
    saveJob,
    removeJob,
    searchJobs,
    refreshJobs
  };
}; 