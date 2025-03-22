export interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  description: string;
  isSaved?: boolean;
}

export interface JobApplication {
  jobId: string;
  name: string;
  email: string;
  phone: string;
  coverLetter: string;
}

export interface ValidationError {
  name?: string;
  email?: string;
  phone?: string;
  coverLetter?: string;
} 