import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    headers?: Record<string, string>;
  }
} 