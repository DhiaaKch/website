import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:8081";

// Define types for your data structures
interface User {
  username: string;
  password: string;
  // Add other user properties as needed
}

interface AuthResponse {
  token: string;
  access_token: string;
  // Add other response properties as needed
}

interface Post {
  id?: string;
  title: string;
  content: string;
  // Add other post properties as needed
}

export const signup = async (user: User): Promise<AuthResponse> => {
  const response: AxiosResponse<AuthResponse> = await axios.post(
    `${API_URL}/user/signup`,
    user
  );
  return response.data;
};

export const login = async (user: User): Promise<AuthResponse> => {
  const response: AxiosResponse<AuthResponse> = await axios.post(
    `${API_URL}/user/login`,
    user
  );
  return response.data;
};

export const getPosts = async (token: string): Promise<Post[]> => {
  const response: AxiosResponse<Post[]> = await axios.get(
    `${API_URL}/posts`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const addPost = async (post: Post, token: string): Promise<Post> => {
  const response: AxiosResponse<Post> = await axios.post(
    `${API_URL}/posts`,
    post,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export interface ScanFinding {
  template_id: string;
  name: string;
  severity: string;
  host: string;
  description?: string;
  matched_at: string;
  extracted_results?: string[];
  curl_command?: string;
  solution?: string;
}

export const startScan = async (target: string): Promise<ScanFinding[]> => {
  const response = await axios.get(`${API_URL}/scan`, {
    params: { target },
  });
  if (response.status !== 200) {
    throw new Error("Failed to start scan");
  }
  return response.data;
}; 
export interface ScanHistory {
  id: string;
  target: string;
  user_id: string;
  total_vulns: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  scan_time: string;
  status: string;
  date: string;
  time: string;
  duration: string;
  score: number;
}

export interface ScanFinding {
  id: string;
  scan_id: string;
  template_id: string;
  name: string;
  severity: string;
  host: string;
  description?: string;
  matched_at: string;
  extracted_results?: string[];
  curl_command?: string;
  solution?: string;
}

export const getScanHistory = async (token: string): Promise<ScanHistory[]> => {
  const response = await axios.get(`${API_URL}/scan/history`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getScanDetails = async (scanId: string, token: string): Promise<ScanHistory> => {
  const response = await axios.get(`${API_URL}/scan/${scanId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getScanFindings = async (scanId: string, token: string): Promise<ScanFinding[]> => {
  const response = await axios.get(`${API_URL}/scan/${scanId}/findings`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
export const getDashboardData = async (token: string) => {
  const response = await axios.get(`${API_URL}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
