const API_BASE_URL = 'https://empllo.com/api/v1';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

// Mock data for Snack testing
const mockJobs = [
  {
    title: "Software Engineer",
    company: "Tech Corp",
    salary: "$100,000 - $150,000",
    location: "New York, NY",
    description: "Looking for a skilled software engineer..."
  },
  {
    title: "Product Manager",
    company: "Innovation Inc",
    salary: "$120,000 - $180,000",
    location: "San Francisco, CA",
    description: "Experienced product manager needed..."
  },
  {
    title: "UX Designer",
    company: "Design Studio",
    salary: "$90,000 - $130,000",
    location: "Remote",
    description: "Creative UX designer with 3+ years..."
  }
];

export const fetchJobs = async (): Promise<ApiResponse<any[]>> => {
  try {
    // For Snack testing, return mock data instead of making API call
    return {
      data: mockJobs,
      error: null,
      status: 200
    };

    // Real API call code (commented out for Snack)
    /*
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    const responseData = await response.text();
    console.log('Response body:', responseData);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    let data;
    try {
      data = JSON.parse(responseData);
    } catch (e) {
      throw new Error('Invalid JSON response');
    }

    return {
      data,
      error: null,
      status: response.status
    };
    */
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch jobs',
      status: 500
    };
  }
}; 