export interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  description: string;
}

export interface JobApplication {
  name: string;
  email: string;
  contactNumber: string;
  whyHireYou: string;
  jobId: string;
}

export interface RootStackParamList {
  JobFinder: undefined;
  SavedJobs: undefined;
  ApplicationForm: { job: Job; fromSavedJobs?: boolean };
} 