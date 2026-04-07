// src/services/mockData.ts
import type { User, Product, Category } from '../types';

/* ================================================================
   USERS
================================================================ */
export const mockUsers: User[] = [
  { id: 1, name: 'Administrador GearForm', email: 'admin@gearform.com',  cpf: '000.000.000-00', role: 'Admin'   },
  { id: 2, name: 'João Desenvolvedor',     email: 'joao@email.com',      cpf: '111.111.111-11', role: 'Usuário' },
  { id: 3, name: 'Maria Técnica',          email: 'maria@email.com',     cpf: '222.222.222-22', role: 'Usuário' },
];

/* ================================================================
   CATEGORIES
================================================================ */
export const mockCategories: Category[] = [
  { id: 1, name: 'Eletrônicos',    description: 'Produtos eletrônicos em geral' },
  { id: 2, name: 'Ferramentas',    description: 'Ferramentas manuais e elétricas' },
  { id: 3, name: 'Segurança',      description: 'EPIs e equipamentos de segurança' },
  { id: 4, name: 'Automação',      description: 'Componentes para automação industrial' },
  { id: 5, name: 'Informática',    description: 'Hardware, periféricos e acessórios' },
];

/* ================================================================
   PRODUCTS
================================================================ */
export const mockProducts: Product[] = [
  { id: 1, name: 'Multímetro Digital',      description: 'Multímetro digital com display LCD', price: 89.90,   stock: 50,  categoryId: 1, category: mockCategories[0] },
  { id: 2, name: 'Chave de Fenda Set',       description: 'Kit com 6 chaves de fenda',          price: 34.90,   stock: 120, categoryId: 2, category: mockCategories[1] },
  { id: 3, name: 'Capacete de Segurança',    description: 'Capacete classe A cor branca',        price: 28.50,   stock: 80,  categoryId: 3, category: mockCategories[2] },
  { id: 4, name: 'CLP Siemens S7-1200',      description: 'Controlador lógico programável',      price: 1490.00, stock: 10,  categoryId: 4, category: mockCategories[3] },
  { id: 5, name: 'Cabo de Rede Cat6 (10m)',  description: 'Cabo de rede UTP Cat6 10 metros',     price: 19.90,   stock: 200, categoryId: 5, category: mockCategories[4] },
  { id: 6, name: 'Arduino Uno R3',           description: 'Placa Arduino Uno original',          price: 79.90,   stock: 35,  categoryId: 1, category: mockCategories[0] },
  { id: 7, name: 'Luva de Proteção',         description: 'Luvas de nitrila tamanho M (cx 100)', price: 42.00,   stock: 60,  categoryId: 3, category: mockCategories[2] },
  { id: 8, name: 'Sensor de Temperatura',    description: 'Sensor DS18B20 à prova d\'água',       price: 12.90,   stock: 150, categoryId: 4, category: mockCategories[3] },
];