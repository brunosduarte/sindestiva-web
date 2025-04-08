import axios from 'axios';
import { getSession } from 'next-auth/react';
import { 
  News, 
  PaginatedResponse, 
  LoginCredentials, 
  LoginResponse, 
  RegisterCredentials, 
  NewsFormData,
  NewsQueryParams
} from '@/types';

// URL base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Cliente axios para endpoints públicos (sem autenticação)
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cliente axios para endpoints protegidos (com autenticação)
const protectedApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação às requisições protegidas
protectedApi.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
  }
  return config;
});

// ENDPOINTS PÚBLICOS
// =================================================================

// Notícias - funções públicas
export async function fetchPublicNews(params?: NewsQueryParams) {
  const response = await publicApi.get<PaginatedResponse<News>>('/news', { params });
  return response.data;
}

export async function fetchPublicNewsById(id: string) {
  const response = await publicApi.get<News>(`/news/${id}`);
  return response.data;
}

// Funções do lado do servidor (usadas nas server components)
export async function getLatestNews(limit: number = 3): Promise<News[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/news?limit=${limit}`, {
      cache: 'no-cache', // Desativar cache para sempre obter as notícias mais recentes
    });
    
    if (!response.ok) {
      throw new Error('Falha ao buscar notícias');
    }
    
    const data = await response.json();
    return data.news || [];
  } catch (error) {
    console.error('Erro ao buscar notícias recentes:', error);
    return [];
  }
}

export async function getAllNews(page: number = 1, limit: number = 10, tag?: string, search?: string): Promise<PaginatedResponse<News>> {
  try {
    let url = `${API_BASE_URL}/news?page=${page}&limit=${limit}`;
    
    if (tag) {
      url += `&tag=${encodeURIComponent(tag)}`;
    }
    
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    
    const response = await fetch(url, {
      cache: 'no-cache', // Desativar cache para sempre obter as notícias mais recentes
    });
    
    if (!response.ok) {
      throw new Error('Falha ao buscar notícias');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar todas notícias:', error);
    return {
      data: [],
      pagination: {
        total: 0,
        page,
        limit,
        totalPages: 0,
      },
    };
  }
}

export async function getNewsDetails(id: string): Promise<News | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/news/${id}`, {
      cache: 'no-cache', 
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Falha ao buscar notícia');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar notícia com ID ${id}:`, error);
    return null;
  }
}

// ENDPOINTS PROTEGIDOS
// =================================================================

// Autenticação
export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await publicApi.post<LoginResponse>('/auth/login', credentials);
  return response.data;
}

export async function registerUser(userData: RegisterCredentials): Promise<LoginResponse> {
  const response = await publicApi.post<LoginResponse>('/auth/register', userData);
  return response.data;
}

export async function getUserProfile() {
  const response = await protectedApi.get('/auth/profile');
  return response.data.user;
}

// Notícias - funções do lado do cliente para administração (protegidas)
export async function fetchNews(params?: NewsQueryParams) {
  const response = await protectedApi.get<PaginatedResponse<News>>('/news', { params });
  return response.data;
}

export async function fetchNewsById(id: string) {
  const response = await protectedApi.get<News>(`/news/${id}`);
  return response.data;
}

export async function createNews(newsData: NewsFormData) {
  const response = await protectedApi.post<News>('/news', newsData);
  return response.data;
}

export async function updateNews(id: string, newsData: Partial<NewsFormData>) {
  const response = await protectedApi.put<News>(`/news/${id}`, newsData);
  return response.data;
}

export async function deleteNews(id: string) {
  const response = await protectedApi.delete(`/news/${id}`);
  return response.data;
}

export async function fetchMyNews(params?: NewsQueryParams) {
  const response = await protectedApi.get<PaginatedResponse<News>>('/news/my', { params });
  return response.data;
}