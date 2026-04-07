// src/services/api.ts
// Integração real com o backend GearForm (Node/Express/Prisma)

import axios from 'axios';
import type { User, Product, Category, PaginatedResponse } from '../types';

// ─── Instância Axios com baseURL e interceptor de token ───────────────────
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({ baseURL: BASE_URL });

// Injeta Bearer token em toda requisição autenticada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor de resposta: normaliza erros no formato { response.data.message }
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Erro inesperado';
    return Promise.reject({ response: { data: { message } } });
  },
);

// ─── Helpers de mapeamento back → front ───────────────────────────────────
// Back usa: nome, senha, created_at | Front usa: name, password, createdAt

function mapUser(u: Record<string, unknown>): User {
  return {
    id:        u.id as number,
    name:      (u.nome ?? u.name) as string,
    email:     u.email as string,
    cpf:       u.cpf as string,
    role:      (u.status ?? u.role ?? 'Usuário') as string,
    createdAt: (u.created_at ?? u.createdAt) as string | undefined,
  };
}

function mapCursoToCategory(c: Record<string, unknown>): Category {
  return {
    id:          c.id as number,
    name:        (c.nome_curso ?? c.name) as string,
    description: (c.descricao ?? c.description ?? '') as string,
    createdAt:   (c.created_at ?? c.createdAt) as string | undefined,
  };
}

function mapModuloToProduct(m: Record<string, unknown>): Product {
  return {
    id:          m.id as number,
    name:        (m.titulo ?? m.name) as string,
    description: (m.descricao ?? m.description ?? '') as string,
    price:       0,
    stock:       (m.ordem as number) ?? 0,
    categoryId:  (m.curso_id ?? m.categoryId) as number,
    createdAt:   (m.created_at ?? m.createdAt) as string | undefined,
  };
}

function paginatedBack<T>(
  data: T[],
  pagination: { page: number; limit: number; total: number; totalPages: number },
): PaginatedResponse<T> {
  return {
    data,
    total:    pagination.total,
    page:     pagination.page,
    perPage:  pagination.limit,
    lastPage: pagination.totalPages,
  };
}

// ─── AUTH SERVICE ─────────────────────────────────────────────────────────
export const authService = {
  login: async (
    email: string,
    password: string,
  ): Promise<{ data: { token: string; user: User } }> => {
    const res = await api.post('/users/login', { email, senha: password });
    return { data: { token: res.data.token, user: mapUser(res.data.user) } };
  },

  register: async (data: {
    name: string;
    email: string;
    cpf: string;
    password: string;
  }): Promise<{ data: User }> => {
    const res = await api.post('/users/register', {
      nome:  data.name,
      email: data.email,
      cpf:   data.cpf,
      senha: data.password,
    });
    return { data: mapUser(res.data.user) };
  },

  me: async (): Promise<{ data: User }> => {
    const res = await api.get('/users/profile');
    return { data: mapUser(res.data) };
  },
};

// ─── USER SERVICE ─────────────────────────────────────────────────────────
export const userService = {
  list: async (page = 1, perPage = 10): Promise<{ data: PaginatedResponse<User> }> => {
    const res = await api.get('/users/profile');
    const user = mapUser(res.data);
    return {
      data: { data: [user], total: 1, page, perPage, lastPage: 1 },
    };
  },

  getById: async (id: number): Promise<{ data: User }> => {
    const res = await api.get('/users/profile');
    const user = mapUser(res.data);
    if (user.id !== id) {
      return Promise.reject({ response: { data: { message: 'Usuário não encontrado' } } });
    }
    return { data: user };
  },

  update: async (
    _id: number,
    data: Partial<{ name: string; cpf: string; password: string }>,
  ): Promise<{ data: User }> => {
    const payload: Record<string, string> = {};
    if (data.name)     payload.nome  = data.name;
    if (data.cpf)      payload.cpf   = data.cpf;
    if (data.password) payload.senha = data.password;
    const res = await api.put('/users/profile', payload);
    return { data: mapUser(res.data.user) };
  },

  delete: async (_id: number): Promise<{ data: Record<string, never> }> => {
    return Promise.reject({
      response: { data: { message: 'Operação não suportada pelo servidor' } },
    });
  },
};

// ─── CATEGORY SERVICE (mapeia Cursos do backend) ──────────────────────────
export const categoryService = {
  list: async (page = 1, perPage = 10): Promise<{ data: PaginatedResponse<Category> }> => {
    const res = await api.get('/cursos', { params: { page, limit: perPage } });
    const mapped = (res.data.data as Record<string, unknown>[]).map(mapCursoToCategory);
    return { data: paginatedBack(mapped, res.data.pagination) };
  },

  listAll: async (): Promise<{ data: Category[] }> => {
    const res = await api.get('/cursos', { params: { page: 1, limit: 1000 } });
    const mapped = (res.data.data as Record<string, unknown>[]).map(mapCursoToCategory);
    return { data: mapped };
  },

  getById: async (id: number): Promise<{ data: Category }> => {
    const res = await api.get(`/cursos/${id}`);
    return { data: mapCursoToCategory(res.data) };
  },

  create: async (data: Partial<Category>): Promise<{ data: Category }> => {
    const res = await api.post('/cursos', {
      titulo:    data.name,
      descricao: data.description,
    });
    return { data: mapCursoToCategory(res.data.curso) };
  },

  update: async (id: number, data: Partial<Category>): Promise<{ data: Category | undefined }> => {
    const res = await api.put(`/cursos/${id}`, {
      titulo:    data.name,
      descricao: data.description,
    });
    return { data: mapCursoToCategory(res.data.curso) };
  },

  delete: async (id: number): Promise<{ data: Record<string, never> }> => {
    await api.delete(`/cursos/${id}`);
    return { data: {} };
  },
};

// ─── PRODUCT SERVICE (mapeia Módulos do backend) ──────────────────────────
export const productService = {
  list: async (page = 1, perPage = 10): Promise<{ data: PaginatedResponse<Product> }> => {
    const cursosRes = await api.get('/cursos', { params: { page: 1, limit: 1000 } });
    const cursos = cursosRes.data.data as Record<string, unknown>[];

    if (cursos.length === 0) {
      return { data: { data: [], total: 0, page, perPage, lastPage: 1 } };
    }

    const allModulos: Product[] = [];
    for (const curso of cursos) {
      const modRes = await api.get(`/modulos/curso/${curso.id}`, {
        params: { page: 1, limit: 1000 },
      });
      const mapped = (modRes.data.data as Record<string, unknown>[]).map(mapModuloToProduct);
      allModulos.push(...mapped);
    }

    const total = allModulos.length;
    const skip  = (page - 1) * perPage;
    const slice = allModulos.slice(skip, skip + perPage);
    return {
      data: {
        data:     slice,
        total,
        page,
        perPage,
        lastPage: Math.max(1, Math.ceil(total / perPage)),
      },
    };
  },

  getById: async (id: number): Promise<{ data: Product }> => {
    const res = await api.get(`/modulos/${id}`);
    return { data: mapModuloToProduct(res.data) };
  },

  create: async (data: Partial<Product>): Promise<{ data: Product }> => {
    const res = await api.post('/modulos', {
      curso_id: data.categoryId,
      titulo:   data.name,
      ordem:    data.stock ?? 1,
    });
    return { data: mapModuloToProduct(res.data.modulo) };
  },

  update: async (id: number, data: Partial<Product>): Promise<{ data: Product | undefined }> => {
    const res = await api.put(`/modulos/${id}`, {
      titulo: data.name,
      ordem:  data.stock,
    });
    return { data: mapModuloToProduct(res.data.modulo) };
  },

  delete: async (id: number): Promise<{ data: Record<string, never> }> => {
    await api.delete(`/modulos/${id}`);
    return { data: {} };
  },
};

export default api;
