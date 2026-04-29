import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export async function fetcher<T>(url: string) {
  const response = await apiClient.get<T>(url);
  return response.data;
}

export default apiClient;
