export interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'editor'
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface News {
  _id: string
  title: string
  content: string
  summary: string
  imageUrl?: string
  published: boolean
  publishDate: string
  tags?: string[]
  author: User | string
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export interface LoginResponse {
  user: User
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export interface NewsFormData {
  title: string
  content: string
  summary: string
  imageUrl?: string
  published: boolean
  publishDate: string
  tags?: string[]
}

export interface NewsQueryParams {
  page?: number
  limit?: number
  tag?: string
  search?: string
}
