import axios from 'axios';
import { Job } from '../types/types';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = 'https://empllo.com/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const jobService = {
  // Get all jobs
  getJobs: async (): Promise<Job[]> => {
    try {
      const response = await api.get('/jobs');
      return response.data.map((job: Omit<Job, 'id'>) => ({
        ...job,
        id: uuidv4(),
      }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  // Search jobs
  searchJobs: async (query: string): Promise<Job[]> => {
    try {
      const response = await api.get(`/jobs/search?q=${encodeURIComponent(query)}`);
      return response.data.map((job: Omit<Job, 'id'>) => ({
        ...job,
        id: uuidv4(),
      }));
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  },

  // Get job by ID
  getJobById: async (id: string): Promise<Job> => {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job:', error);
      throw error;
    }
  },

  // Apply for a job
  applyForJob: async (jobId: string, application: any): Promise<void> => {
    try {
      await api.post(`/jobs/${jobId}/apply`, application);
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
  }
}; 