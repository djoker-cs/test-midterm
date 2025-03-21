const API_BASE_URL = 'https://empllo.com/api/v1';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export const fetchJobs = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await fetch(API_BASE_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      data,
      error: null
    };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch jobs'
    };
  }
}; 