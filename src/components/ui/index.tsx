

import type { ReactNode, InputHTMLAttributes, SelectHTMLAttributes } from "react";


interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  size = 'md',
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''}`}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Carregando...
        </span>
      ) : children}
    </button>
  );
}


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, id, ...props }: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s/g, '-');
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={inputId}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors
          ${error
            ? 'border-red-400 focus:ring-red-300 bg-red-50'
            : 'border-gray-300 focus:ring-indigo-300 focus:border-indigo-400'
          }`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}
    </div>
  );
}


interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
}

export function Select({ label, error, options, placeholder, id, ...props }: SelectProps) {
  const inputId = id || label.toLowerCase().replace(/\s/g, '-');
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={inputId}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors bg-white
          ${error ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-indigo-300'}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">⚠ {error}</p>}
    </div>
  );
}


interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({ label, error, id, ...props }: TextareaProps) {
  const inputId = id || label.toLowerCase().replace(/\s/g, '-');
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={inputId}
        rows={3}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 resize-none transition-colors
          ${error ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-indigo-300'}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">⚠ {error}</p>}
    </div>
  );
}


interface AlertProps {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export function Alert({ type, message, onClose }: AlertProps) {
  const styles = {
    error: 'bg-red-50 border-red-400 text-red-700',
    success: 'bg-green-50 border-green-400 text-green-700',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-700',
    info: 'bg-blue-50 border-blue-400 text-blue-700',
  };
  const icons = { error: '✕', success: '✓', warning: '⚠', info: 'ℹ' };

  return (
    <div className={`flex items-start justify-between p-3 rounded-lg border text-sm ${styles[type]}`}>
      <span className="flex items-center gap-2">
        <span className="font-bold">{icons[type]}</span>
        {message}
      </span>
      {onClose && (
        <button onClick={onClose} className="ml-3 opacity-60 hover:opacity-100">✕</button>
      )}
    </div>
  );
}


export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}


export function LoadingSpinner({ text = 'Carregando...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}


interface BadgeProps {
  children: ReactNode;
  color?: 'gray' | 'blue' | 'green' | 'red' | 'yellow';
}

export function Badge({ children, color = 'gray' }: BadgeProps) {
  const colors = {
    gray: 'bg-gray-100 text-gray-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}


interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, isLoading }: ConfirmModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>Confirmar</Button>
        </div>
      </div>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, lastPage, total, perPage, onPageChange }: PaginationProps) {
  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
      <p className="text-sm text-gray-500">
        Mostrando <strong>{from}–{to}</strong> de <strong>{total}</strong> registros
      </p>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ← Anterior
        </button>
        {Array.from({ length: lastPage }, (_, i) => i + 1)
          .filter(p => Math.abs(p - currentPage) <= 2)
          .map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors
                ${page === currentPage
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-gray-200 hover:bg-gray-50'}`}
            >
              {page}
            </button>
          ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Próximo →
        </button>
      </div>
    </div>
  );
}


export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
      <div className="text-4xl mb-2">📭</div>
      <h3 className="text-base font-semibold text-gray-700">{title}</h3>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
}

/* ================================================================
   Tipos existentes (mantidos)
================================================================ */
export interface User {
  id: number;
  nome: string;       // alinhado com o banco: coluna "nome"
  email: string;
  cpf: string;
  avatar?: string;    // URL da foto de perfil (novo campo)
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
  nome: string;
  email: string;
  cpf: string;
  password: string;
}

export interface EditUserData {
  nome?: string;
  avatar?: string;
  currentPassword?: string;
  newPassword?: string;
}

/* ================================================================
   Novos tipos — Cursos
================================================================ */
export type Categoria =
  | 'Programação'
  | 'Eletromecânica'
  | 'Eletrônica'
  | 'Redes'
  | 'Design'
  | 'Gestão'
  | 'Outro';

export type Nivel = 'Iniciante' | 'Intermediário' | 'Avançado';

export type StatusMatricula = 'ativo' | 'concluido' | 'cancelado';

export interface Curso {
  id: number;
  titulo: string;
  descricao: string;
  categoria: Categoria;
  nivel: Nivel;
  carga_horaria: number;    // em horas
  preco: number;
  certificado: boolean;
  ativo: boolean;
  imagem_url?: string;
  createdAt?: string;
  updatedAt?: string;

  /* Relações carregadas junto */
  modulos?: Modulo[];
  _count?: { modulos: number };
}

/* ================================================================
   Novos tipos — Módulos
================================================================ */
export interface Modulo {
  id: number;
  titulo: string;
  ordem: number;
  cursoId: number;
  createdAt?: string;

  /* Questões (podem vir no payload ou serem geradas no front) */
  questoes?: Questao[];
}

/* ================================================================
   Novos tipos — Questões (múltipla escolha)
================================================================ */
export interface Questao {
  id: number;
  pergunta: string;
  opcoes: string[];
  correta: number;   // índice (0-based) da opção correta
  explicacao: string;
}

/* ================================================================
   Novos tipos — Matrículas
================================================================ */
export interface Matricula {
  id?: number;
  userId: number;
  cursoId: number;
  status: StatusMatricula;
  progresso: number;          // 0.00 – 100.00
  data_matricula?: string;
  modulos_feitos?: number[];  // IDs/índices dos módulos concluídos (front only)

  /* Relações */
  curso?: Curso;
}

/* ================================================================
   Respostas paginadas (genérico)
================================================================ */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
}

/* ================================================================
   Erros de API
================================================================ */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}