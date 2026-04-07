// src/types/index.ts

export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  cpf: string;
  password: string;
  confirmPassword?: string;
}

export interface EditUserData {
  name: string;
  cpf: string;
  password?: string;
  confirmPassword?: string;
}

export interface Curso {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  nivel: string;
  carga_horaria: number;
  preco: number;
  certificado: boolean;
  ativo: boolean;
}

export interface Modulo {
  id: number;
  titulo: string;
  ordem: number;
  cursoId: number;
}

export interface Matricula {
  userId: number;
  cursoId: number;
  status: string;
  progresso: number;
  modulos_feitos: number[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  category?: Category;
  stock: number;
  createdAt?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number | string;
  categoryId: number | string;
  stock: number | string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface CursoCard {
  id: number;
  titulo: string;
  cat: string;
  nivel: string;
  carga: number;
  preco: number;
  modulos: number;
  emoji: string;
  desc: string;
}

export interface MatriculaLocal {
  cursoId: number;
  progresso: number;
  status: string;
  modulos_feitos: number[];
}