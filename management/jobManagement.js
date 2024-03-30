// jobManagement.js

// Function to get all jobs from local storage
export function getJobs() {
  const jobsData = localStorage.getItem('jobs');
  return jobsData ? JSON.parse(jobsData) : [];
}

// Function to save jobs to local storage
function saveJobs(jobs) {
  localStorage.setItem('jobs', JSON.stringify(jobs));
}

// Function to add a new job
export function addJob(job) {
  const jobs = getJobs();
  const newJob = {
    id: generateJobId(),
    name: job.name,
    description: job.description,
    // Add more job properties as needed
  };
  jobs.push(newJob);
  saveJobs(jobs);
  return newJob;
}

// Function to update an existing job
export function updateJob(jobId, updatedJob) {
  const jobs = getJobs();
  const index = jobs.findIndex(job => job.id === jobId);
  if (index !== -1) {
    jobs[index] = { ...jobs[index], ...updatedJob };
    saveJobs(jobs);
    return jobs[index];
  }
  return null;
}

// Function to delete a job
export function deleteJob(jobId) {
  const jobs = getJobs();
  const index = jobs.findIndex(job => job.id === jobId);
  if (index !== -1) {
    const deletedJob = jobs.splice(index, 1)[0];
    saveJobs(jobs);
    return deletedJob;
  }
  return null;
}

// Function to generate a unique job ID
function generateJobId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Function to get a job by ID
export function getJobById(jobId) {
  const jobs = getJobs();
  return jobs.find(job => job.id === jobId);
}

// Function to search jobs by name or description
export function searchJobs(query) {
  const jobs = getJobs();
  return jobs.filter(job =>
    job.name.toLowerCase().includes(query.toLowerCase()) ||
    job.description.toLowerCase().includes(query.toLowerCase())
  );
}
