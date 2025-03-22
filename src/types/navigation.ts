import { Job } from './types';

export type RootStackParamList = {
  JobFinder: undefined;
  SavedJobs: undefined;
  ApplicationForm: { job: Job; fromSavedJobs?: boolean };
}; 