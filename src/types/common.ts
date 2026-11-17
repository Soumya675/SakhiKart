export type LanguageCode = 'en' | 'hi' | 'or';

export type DataSourceMode = 'demo' | 'production';

export interface ApiResponse<T> {
  data: T;
  source: DataSourceMode;
  timestamp: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  source: DataSourceMode;
}

export interface AsyncState<T> {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: T | null;
  error: string | null;
}
