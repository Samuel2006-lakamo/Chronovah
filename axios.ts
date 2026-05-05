// config/axios.ts
import axios, { AxiosError } from "axios";

const isDevelopment = import.meta.env.DEV;

// In dev use localhost, in production use the hosted backend
const API_URL = isDevelopment
  ? "http://localhost:8000/api/v1"
  : (import.meta.env.VITE_API_URL || "https://api-chronovah-backend.onrender.com/api/v1");

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const publicAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export const protectedAxios = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const responseInterceptor = async (error: AxiosError<any>) => {
  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      return Promise.reject({
        message: "Request timeout. Please check your connection.",
        status: 408,
      });
    }

    if (error.message?.includes("Network Error")) {
      return Promise.reject({
        message: "Network error. Please check internet connection.",
        status: 0,
      });
    }

    return Promise.reject({
      message: "Unable to connect to server.",
      status: 0,
    });
  }

  const status = error.response.status;
  const errorData = error.response.data;

  if (isDevelopment) {
    console.error(`❌ API Error [${status}]`, errorData);
  }


  switch (status) {
    case 400:
      return Promise.reject({
        message: errorData?.error || errorData?.message || "Bad request.",
        status,
      });

    case 401:
      return Promise.reject({
        message: errorData?.error || errorData?.message || "Invalid credentials.",
        status,
      });

    case 403:
      // Handle PRO_REQUIRED specifically
      if (errorData?.code === 'PRO_REQUIRED') {
        return Promise.reject({
          message: errorData?.error || "Pro subscription required",
          code: 'PRO_REQUIRED',
          upgradeUrl: errorData?.upgradeUrl || '/upgrade',
          status,
        });
      }
      return Promise.reject({
        message: errorData?.error || errorData?.message || "Permission denied.",
        status,
      });

    case 404:
      return Promise.reject({
        message: errorData?.error || errorData?.message || "Resource not found.",
        status,
      });

    case 422:
      return Promise.reject({
        message: errorData?.error || errorData?.message || "Validation failed.",
        errors: errorData?.errors,
        status,
      });

    case 429:
      return Promise.reject({
        message: errorData?.error || errorData?.message || "Too many requests. Please slow down.",
        status,
      });

    case 500:
      return Promise.reject({
        message: errorData?.error || errorData?.message || "Server error. Please try again later.",
        status,
      });

    default:
      return Promise.reject({
        message: errorData?.error || errorData?.message || "Unexpected error occurred.",
        status,
      });
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (isDevelopment) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);

      if (config.data) console.log("📦 Request Data:", config.data);
      if (config.params) console.log("🔍 Params:", config.params);
    }

    return config;
  },
  (error) => Promise.reject(error),
);


publicAxios.interceptors.request.use(
  (config) => {
    if (isDevelopment) {
      console.log(`${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use((response) => {
  if (isDevelopment) {
    console.log(` Response [${response.status}]`, response.data);
  }

  return response;
}, responseInterceptor);

protectedAxios.interceptors.response.use((response) => {
  if (isDevelopment) {
    console.log(` Protected Response [${response.status}]`);
  }

  return response;
}, responseInterceptor);

publicAxios.interceptors.response.use(
  (response) => {
    if (isDevelopment) {
      console.log(` Public Response [${response.status}]`);
    }

    return response;
  },
  (error) => Promise.reject(error),
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isAxiosError = (error: any): boolean => {
  return error?.isAxiosError || error?.response !== undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMessage = (error: any): string => {
  if (error?.message) return error.message;
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.response?.data?.message) return error.response.data.message;

  return "An unexpected error occurred";
};

export default axiosInstance;
