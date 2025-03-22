// Job related types
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
  name: string;
  email: string;
  phone: string;
  coverLetter: string;
  jobId: string;
}

// Navigation types
export type RootStackParamList = {
  JobFinder: undefined;
  SavedJobs: undefined;
};

// Theme types
export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export interface ValidationError {
  name?: string;
  email?: string;
  phone?: string;
  coverLetter?: string;
} 