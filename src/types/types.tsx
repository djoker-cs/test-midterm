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

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export type ValidationError = {
  field: string;
  message: string;
}; 