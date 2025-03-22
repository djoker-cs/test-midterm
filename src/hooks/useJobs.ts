import { useState, useEffect } from 'react';
import { Job } from '../types/types';
import { jobService } from '../services/api';

interface UseJobsReturn {
  jobs: Job[];
  savedJobs: Job[];
  loading: boolean;
  error: string | null;
  saveJob: (job: Job) => Promise<void>;
  removeJob: (jobId: string) => Promise<void>;
  searchJobs: (query: string) => Promise<void>;
  refreshJobs: () => Promise<void>;
}

export const useJobs = (): UseJobsReturn => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getJobs();
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const searchJobs = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobService.searchJobs(query);
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search jobs');
    } finally {
      setLoading(false);
    }
  };

  const saveJob = async (job: Job) => {
    try {
      if (!savedJobs.some(savedJob => savedJob.id === job.id)) {
        setSavedJobs(prev => [...prev, job]);
      }
    } catch (err) {
      console.error('Error saving job:', err);
    }
  };

  const removeJob = async (jobId: string) => {
    try {
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
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
    searchJobs,
    refreshJobs: fetchJobs
  };
}; 