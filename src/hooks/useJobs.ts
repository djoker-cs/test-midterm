import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { Job } from '../types/types';
import { fetchJobs } from '../utils/api';

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSavedJobs();
    loadJobs();
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

  const loadJobs = async () => {
    setLoading(true);
    const response = await fetchJobs();
    
    if (response.error) {
      setError(response.error);
      setLoading(false);
      return;
    }

    if (response.data) {
      // Add unique IDs to jobs and check if they're saved
      const jobsWithIds = response.data.map((job: Omit<Job, 'id'>) => ({
        ...job,
        id: uuid.v4().toString(),
        isSaved: savedJobs.some(savedJob => 
          savedJob.title === job.title && 
          savedJob.company === job.company
        )
      }));
      
      setJobs(jobsWithIds);
    }
    
    setLoading(false);
  };

  const saveJob = async (job: Job) => {
    // Check if job is already saved
    const isAlreadySaved = savedJobs.some(
      savedJob => savedJob.title === job.title && savedJob.company === job.company
    );

    if (isAlreadySaved) {
      return;
    }

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
    refreshJobs: loadJobs,
  };
}; 