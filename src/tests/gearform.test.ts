// src/tests/gearform.test.ts
// Rode com: npm run test

import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidCPF, formatCPF, getPasswordStrength, getApiErrorMessage } from '../utils';
import { authService, userService, categoryService, productService } from '../services/api';
import { makeQuestions, CURSOS_DATA } from '../types/cursos';

// ─────────────────────────────────────────────────────────────
// TESTE 1 — Validação de e-mail (regex)
// ─────────────────────────────────────────────────────────────
describe('isValidEmail — validação por regex', () => {
  it('aceita formatos válidos de e-mail', () => {
    expect(isValidEmail('usuario@email.com')).toBe(true);
    expect(isValidEmail('admin@gearform.com.br')).toBe(true);
    expect(isValidEmail('nome+tag@dominio.org')).toBe(true);
  });

  it('rejeita e-mails mal formados', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('semArroba.com')).toBe(false);
    expect(isValidEmail('@semdomain')).toBe(false);
    expect(isValidEmail('usuario@')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// TESTE 2 — Validação de CPF (algoritmo completo)
// ─────────────────────────────────────────────────────────────
describe('isValidCPF — algoritmo de dígitos verificadores', () => {
  it('aceita CPFs válidos com e sem formatação', () => {
    expect(isValidCPF('529.982.247-25')).toBe(true);
    expect(isValidCPF('52998224725')).toBe(true);
    expect(isValidCPF('111.444.777-35')).toBe(true);
  });

  it('rejeita CPFs com dígito verificador errado', () => {
    expect(isValidCPF('529.982.247-26')).toBe(false);
  });

  it('rejeita CPFs com todos os dígitos iguais', () => {
    expect(isValidCPF('000.000.000-00')).toBe(false);
    expect(isValidCPF('111.111.111-11')).toBe(false);
    expect(isValidCPF('99999999999')).toBe(false);
  });

  it('rejeita CPFs com comprimento incorreto', () => {
    expect(isValidCPF('123')).toBe(false);
    expect(isValidCPF('')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// TESTE 3 — Formatação de CPF
// ─────────────────────────────────────────────────────────────
describe('formatCPF — formatação progressiva', () => {
  it('formata 11 dígitos no padrão XXX.XXX.XXX-XX', () => {
    expect(formatCPF('52998224725')).toBe('529.982.247-25');
    expect(formatCPF('11144477735')).toBe('111.444.777-35');
  });

  it('formata parcialmente enquanto o usuário digita', () => {
    expect(formatCPF('529')).toBe('529');
    expect(formatCPF('52998')).toBe('529.98');
    expect(formatCPF('52998224')).toBe('529.982.24');
  });

  it('ignora caracteres não numéricos na entrada', () => {
    expect(formatCPF('529.982.247-25')).toBe('529.982.247-25');
  });

  it('limita a 11 dígitos', () => {
    expect(formatCPF('529982247259999')).toBe('529.982.247-25');
  });
});

// ─────────────────────────────────────────────────────────────
// TESTE 4 — Força de senha
// ─────────────────────────────────────────────────────────────
describe('getPasswordStrength — análise de força', () => {
  it('classifica senha fraca (score <= 1)', () => {
    const r = getPasswordStrength('abc');
    expect(r.score).toBeLessThanOrEqual(1);
    expect(r.label).toBe('Fraca');
  });

  it('classifica senha média — letras e números (score 2)', () => {
    const r = getPasswordStrength('senha123');
    expect(r.score).toBe(2);
    expect(r.label).toBe('Média');
  });

  it('classifica senha boa — maiúscula + número (score 3)', () => {
    const r = getPasswordStrength('Senha123');
    expect(r.score).toBe(3);
    expect(r.label).toBe('Boa');
  });

  it('classifica senha forte — maiúscula + número + símbolo (score 4)', () => {
    const r = getPasswordStrength('Senha@123');
    expect(r.score).toBe(4);
    expect(r.label).toBe('Forte');
  });
});

// ─────────────────────────────────────────────────────────────
// TESTE 5 — Tratamento de erros da API
// ─────────────────────────────────────────────────────────────
describe('getApiErrorMessage — extração de mensagem de erro', () => {
  it('extrai message de response.data', () => {
    expect(getApiErrorMessage({ response: { data: { message: 'E-mail já cadastrado' } } }))
      .toBe('E-mail já cadastrado');
  });

  it('extrai message diretamente do error quando sem response', () => {
    expect(getApiErrorMessage({ message: 'Network Error' })).toBe('Network Error');
  });

  it('retorna mensagem padrão para tipos desconhecidos', () => {
    const fallback = 'Ocorreu um erro inesperado. Tente novamente.';
    expect(getApiErrorMessage(null)).toBe(fallback);
    expect(getApiErrorMessage(undefined)).toBe(fallback);
    expect(getApiErrorMessage('oops')).toBe(fallback);
  });
});

// ─────────────────────────────────────────────────────────────
// TESTE 6 — Login (autenticação)
// ─────────────────────────────────────────────────────────────
describe('authService.login', () => {
  it('retorna token e user sem senha para credenciais corretas', async () => {
    const res = await authService.login('admin@gearform.com', 'admin123');
    expect(res.data.token).toMatch(/^mock-token-\d+$/);
    expect(res.data.user.email).toBe('admin@gearform.com');
    expect(res.data.user.name).toBeDefined();
    expect((res.data.user as Record<string, unknown>).password).toBeUndefined();
  });

  it('também aceita usuários não-admin', async () => {
    const res = await authService.login('joao@email.com', '123456');
    expect(res.data.user.email).toBe('joao@email.com');
  });

  it('lança erro para senha incorreta', async () => {
    await expect(authService.login('admin@gearform.com', 'senhaerrada'))
      .rejects.toMatchObject({ response: { data: { message: 'E-mail ou senha incorretos' } } });
  });

  it('lança erro para e-mail inexistente', async () => {
    await expect(authService.login('fantasma@email.com', 'qualquer'))
      .rejects.toMatchObject({ response: { data: { message: 'E-mail ou senha incorretos' } } });
  });
});

// ─────────────────────────────────────────────────────────────
// TESTE 7 — Cadastro de usuário
// ─────────────────────────────────────────────────────────────
describe('authService.register', () => {
  it('cadastra usuário com dados válidos e não retorna senha', async () => {
    const email = `novo_${Date.now()}@email.com`;
    const res = await authService.register({ name: 'Novo Usuário', email, cpf: '52998224725', password: 'Senha@123' });
    expect(res.data.name).toBe('Novo Usuário');
    expect(res.data.email).toBe(email);
    expect(res.data.id).toBeGreaterThan(0);
    expect((res.data as Record<string, unknown>).password).toBeUndefined();
  });

  it('normaliza e-mail para minúsculas', async () => {
    const email = `MAIUSCULO_${Date.now()}@Email.COM`;
    const res = await authService.register({ name: 'Teste', email, cpf: '11144477735', password: 'Abc@1234' });
    expect(res.data.email).toBe(email.toLowerCase());
  });

  it('rejeita e-mail duplicado com mensagem clara', async () => {
    await expect(
      authService.register({ name: 'Dup', email: 'admin@gearform.com', cpf: '00000000000', password: 'Abc@1234' })
    ).rejects.toMatchObject({ response: { data: { message: 'E-mail já cadastrado' } } });
  });
});

// ─────────────────────────────────────────────────────────────
// TESTE 8 — CRUD de usuários com paginação
// ─────────────────────────────────────────────────────────────
describe('userService — CRUD e paginação', () => {
  it('lista usuários e retorna estrutura de paginação', async () => {
    const res = await userService.list(1, 10);
    const { data, total, page, lastPage, perPage } = res.data;
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(total).toBeGreaterThan(0);
    expect(page).toBe(1);
    expect(lastPage).toBeGreaterThanOrEqual(1);
    expect(perPage).toBe(10);
    data.forEach(u => expect((u as Record<string, unknown>).password).toBeUndefined());
  });

  it('busca usuário existente pelo ID', async () => {
    const res = await userService.getById(1);
    expect(res.data.id).toBe(1);
    expect(res.data.name).toBeDefined();
    expect(res.data.email).toBeDefined();
  });

  it('lança erro ao buscar ID inexistente', async () => {
    await expect(userService.getById(99999))
      .rejects.toMatchObject({ response: { data: { message: 'Usuário não encontrado' } } });
  });

  it('atualiza o name do usuário', async () => {
    const res = await userService.update(2, { name: 'Nome Atualizado Test' });
    expect(res.data.name).toBe('Nome Atualizado Test');
  });

  it('exclui usuário e ele desaparece', async () => {
    const email = `del_${Date.now()}@email.com`;
    const reg = await authService.register({ name: 'Para Excluir', email, cpf: '52998224725', password: 'Abc@1234' });
    await userService.delete(reg.data.id);
    await expect(userService.getById(reg.data.id))
      .rejects.toMatchObject({ response: { data: { message: 'Usuário não encontrado' } } });
  });
});

// ─────────────────────────────────────────────────────────────
// TESTE 9 — CRUD de categorias
// ─────────────────────────────────────────────────────────────
describe('categoryService — CRUD e paginação', () => {
  it('lista categorias com paginação', async () => {
    const res = await categoryService.list(1, 10);
    expect(Array.isArray(res.data.data)).toBe(true);
    expect(res.data.data.length).toBeGreaterThan(0);
    expect(res.data.total).toBeGreaterThan(0);
  });

  it('cria categoria e a encontra na listagem', async () => {
    const created = await categoryService.create({ name: 'Cat Teste', description: 'Desc teste' });
    expect(created.data.name).toBe('Cat Teste');

    const list = await categoryService.list(1, 100);
    const found = list.data.data.find(c => c.id === created.data.id);
    expect(found).toBeDefined();
    expect(found!.description).toBe('Desc teste');
  });

  it('atualiza categoria existente', async () => {
    const created = await categoryService.create({ name: 'Antiga', description: 'Desc' });
    const updated = await categoryService.update(created.data.id, { name: 'Nova Nome', description: 'Nova Desc' });
    expect(updated.data?.name).toBe('Nova Nome');
  });

  it('exclui categoria e ela some da listagem', async () => {
    const created = await categoryService.create({ name: 'Para Excluir', description: 'X' });
    await categoryService.delete(created.data.id);
    const list = await categoryService.list(1, 100);
    expect(list.data.data.find(c => c.id === created.data.id)).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────
// TESTE 10 — CRUD de produtos + estrutura de cursos
// ─────────────────────────────────────────────────────────────
describe('productService — CRUD e paginação', () => {
  it('lista produtos com paginação', async () => {
    const res = await productService.list(1, 10);
    expect(Array.isArray(res.data.data)).toBe(true);
    expect(res.data.data.length).toBeGreaterThan(0);
    expect(res.data.total).toBeGreaterThan(0);
    expect(res.data.lastPage).toBeGreaterThanOrEqual(1);
  });

  it('cria produto e recupera pelo ID com valores corretos', async () => {
    const created = await productService.create({ name: 'Produto Teste', description: 'Desc completa', price: 149.90, stock: 25, categoryId: 1 });
    expect(created.data.name).toBe('Produto Teste');
    expect(created.data.price).toBe(149.90);

    const fetched = await productService.getById(created.data.id);
    expect(fetched.data.id).toBe(created.data.id);
  });

  it('atualiza produto existente', async () => {
    const created = await productService.create({ name: 'Antes', description: 'D', price: 10, stock: 5, categoryId: 1 });
    await productService.update(created.data.id, { name: 'Depois', description: 'D2', price: 20, stock: 10, categoryId: 1 });
    const res = await productService.getById(created.data.id);
    expect(res.data.name).toBe('Depois');
    expect(res.data.price).toBe(20);
  });

  it('lança erro ao buscar produto inexistente', async () => {
    await expect(productService.getById(999999))
      .rejects.toMatchObject({ response: { data: { message: 'Produto não encontrado' } } });
  });

  it('exclui produto e ele some', async () => {
    const created = await productService.create({ name: 'Del', description: 'D', price: 1, stock: 1, categoryId: 1 });
    await productService.delete(created.data.id);
    await expect(productService.getById(created.data.id))
      .rejects.toMatchObject({ response: { data: { message: 'Produto não encontrado' } } });
  });

  it('makeQuestions gera 3 questões válidas por módulo', () => {
    const curso = CURSOS_DATA[0];
    const qs = makeQuestions(curso.titulo, 0);
    expect(qs).toHaveLength(3);
    qs.forEach(q => {
      expect(q.pergunta).toBeTruthy();
      expect(q.opcoes).toHaveLength(4);
      expect(q.correta).toBeGreaterThanOrEqual(0);
      expect(q.correta).toBeLessThan(4);
      expect(q.explicacao).toBeTruthy();
    });
  });
});