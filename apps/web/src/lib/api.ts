import axios from 'axios';
import { auth } from './firebase';

export const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  timeout: 30000,
});

// Attach Firebase token to every request
apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error normalization
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      auth.signOut();
    }
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  },
);

// ─── API Functions ─────────────────────────────────────────────────────────────

export const api = {
  // Auth
  getMe: () => apiClient.get('/auth/me'),

  // Profile
  getProfile: () => apiClient.get('/profile'),
  updateProfile: (data: any) => apiClient.put('/profile', data),
  getCompleteness: () => apiClient.get('/profile/completeness'),

  // Resume
  getResume: () => apiClient.get('/resume'),
  uploadResume: async (file: File) => {
    const form = new FormData();
    form.append('resume', file);
    const token = await auth.currentUser?.getIdToken();
    return apiClient.post('/resume/upload', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
      onUploadProgress: undefined,
    });
  },
  getResumeStatus: (jobId: string) => apiClient.get(`/resume/status/${jobId}`),

  // GitHub
  getGitHub: () => apiClient.get('/github'),
  connectGitHub: (username: string) => apiClient.post('/github/connect', { username }),
  getGitHubStatus: (jobId: string) => apiClient.get(`/github/status/${jobId}`),

  // Coding
  getCodingProfiles: () => apiClient.get('/coding'),
  connectCoding: (platform: string, username: string) =>
    apiClient.post('/coding/connect', { platform, username }),
  disconnectCoding: (platform: string) => apiClient.delete(`/coding/${platform}`),

  // Analysis
  getAnalyses: () => apiClient.get('/analysis'),
  getAnalysis: (id: string) => apiClient.get(`/analysis/${id}`),
  startAnalysis: () => apiClient.post('/analysis/start'),

  // Report
  getReport: (id: string) => apiClient.get(`/report/${id}`),
  getReportSummary: (id: string) => apiClient.get(`/report/${id}/summary`),

  // Dashboard
  getDashboard: () => apiClient.get('/dashboard'),

  // Jobs
  getJobRecommendations: (analysisId?: string) => 
    analysisId ? apiClient.get(`/jobs/recommendations/${analysisId}`) : apiClient.get('/jobs/recommendations'),
  getJobHistory: () => apiClient.get('/jobs/history'),
  refreshJobRecommendations: (analysisId?: string) => 
    apiClient.post('/jobs/recommendations/refresh', { analysisId }),
  getJob: (id: string) => apiClient.get(`/jobs/${id}`),
};
