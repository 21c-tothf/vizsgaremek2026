export interface ApiErrorResponse {
  message: string;
  status?: number;
  timestamp?: string;
  path?: string;
  error?: string;
  details?: string[];
  errors?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}