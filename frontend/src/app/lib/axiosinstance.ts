import axios, { AxiosInstance } from "axios";

// Resolve base URL from env or sensible defaults
const resolveBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (envUrl) return envUrl;
  if (typeof window !== "undefined") {
    try {
      const { protocol, hostname } = window.location;
      return `${protocol}//${hostname}:3001`;
    } catch {
      // noop
    }
  }
  return "http://localhost:3001";
};

const BASE_URL = resolveBaseUrl();

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});