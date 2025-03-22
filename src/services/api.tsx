import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { Job, JobApplication } from '../types/types';

const API_BASE_URL = 'https://empllo.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const jobService = {
  getJobs: async (): Promise<Job[]> => {
    try {
      const response = await api.get('/jobs');
      // Add unique IDs to jobs
      return response.data.map((job: Omit<Job, 'id'>) => ({
        ...job,
        id: uuidv4(),
        isSaved: false,
      }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  searchJobs: async (query: string): Promise<Job[]> => {
    try {
      const response = await api.get(`/jobs/search?q=${encodeURIComponent(query)}`);
      return response.data.map((job: Omit<Job, 'id'>) => ({
        ...job,
        id: uuidv4(),
        isSaved: false,
      }));
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  },

  submitApplication: async (application: JobApplication): Promise<void> => {
    try {
      await api.post(`/jobs/${application.jobId}/apply`, application);
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  },
}; 