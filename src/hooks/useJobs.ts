import { useState, useEffect } from 'react';
import { Job } from '../types/types';
import { jobService } from '../services/api';

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

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

  const saveJob = (job: Job) => {
    if (!savedJobs.some(savedJob => savedJob.id === job.id)) {
      setSavedJobs(prev => [...prev, { ...job, isSaved: true }]);
      setJobs(prev => 
        prev.map(j => j.id === job.id ? { ...j, isSaved: true } : j)
      );
    }
  };

  const removeJob = (jobId: string) => {
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
    setJobs(prev => 
      prev.map(j => j.id === jobId ? { ...j, isSaved: false } : j)
    );
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