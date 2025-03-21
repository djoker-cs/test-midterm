import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { Job } from '../types';

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSavedJobs();
    fetchJobs();
  }, []);

  const loadSavedJobs = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedJobs');
      if (saved) {
        setSavedJobs(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Error loading saved jobs:', err);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch('https://empllo.com/api/v1');
      const data = await response.json();
      
      // Add unique IDs to jobs
      const jobsWithIds = data.map((job: Omit<Job, 'id'>) => ({
        ...job,
        id: uuid.v4().toString(),
      }));
      
      setJobs(jobsWithIds);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch jobs');
      setLoading(false);
    }
  };

  const saveJob = async (job: Job) => {
    try {
      const updatedSavedJobs = [...savedJobs, { ...job, isSaved: true }];
      await AsyncStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
      setSavedJobs(updatedSavedJobs);
      
      // Update the job in the main list
      setJobs(jobs.map(j => j.id === job.id ? { ...j, isSaved: true } : j));
    } catch (err) {
      console.error('Error saving job:', err);
    }
  };

  const removeJob = async (jobId: string) => {
    try {
      const updatedSavedJobs = savedJobs.filter(job => job.id !== jobId);
      await AsyncStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
      setSavedJobs(updatedSavedJobs);
      
      // Update the job in the main list
      setJobs(jobs.map(j => j.id === jobId ? { ...j, isSaved: false } : j));
    } catch (err) {
      console.error('Error removing job:', err);
    }
  };

  return {
    jobs,
    savedJobs,
    loading,
    error,
    saveJob,
    removeJob,
  };
}; 