// Mock data to simulate API response
const mockJobs = [
  {
    title: "Senior React Native Developer",
    company: "Tech Solutions Inc",
    salary: "$120,000 - $150,000",
    location: "New York, NY",
    description: "We are looking for an experienced React Native developer to join our team."
  },
  {
    title: "Mobile App Developer",
    company: "Digital Innovations",
    salary: "$90,000 - $120,000",
    location: "San Francisco, CA",
    description: "Join our dynamic team building cutting-edge mobile applications."
  },
  {
    title: "Frontend Developer",
    company: "WebTech Solutions",
    salary: "$80,000 - $100,000",
    location: "Remote",
    description: "Looking for a talented frontend developer with React Native experience."
  },
  {
    title: "Software Engineer",
    company: "Innovation Labs",
    salary: "$95,000 - $130,000",
    location: "Austin, TX",
    description: "Be part of our growing team developing mobile solutions."
  },
  {
    title: "React Native Specialist",
    company: "Mobile First Co",
    salary: "$110,000 - $140,000",
    location: "Seattle, WA",
    description: "Help us build the next generation of mobile applications."
  }
];

// Mock API function
export const getMockJobs = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockJobs;
}; 