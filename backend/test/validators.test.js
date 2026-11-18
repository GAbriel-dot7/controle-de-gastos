import test from 'node:test';
import assert from 'node:assert/strict';
import { expenseSchema, expenseUpdateSchema } from '../src/validators/expense.js';
import { monthCloseSchema } from '../src/validators/month.js';
import { registerSchema } from '../src/validators/auth.js';

const validExpense = {
  description: 'Mercado',
  amount: '125.50',
  dueDate: '2026-11-18',
  categoryId: 'category-1',
};

test('aceita uma despesa válida', () => {
  const parsed = expenseSchema.safeParse(validExpense);
  assert.equal(parsed.success, true);
  assert.equal(parsed.data.paymentStatus, 'PENDING');
});

test('rejeita dia inexistente na data da despesa', () => {
  const parsed = expenseSchema.safeParse({ ...validExpense, dueDate: '2026-02-31' });
  assert.equal(parsed.success, false);
});

test('rejeita formato de data que não seja ISO', () => {
  const parsed = expenseUpdateSchema.safeParse({ dueDate: '18/11/2026' });
  assert.equal(parsed.success, false);
});

test('rejeita mês encerrado fora do intervalo', () => {
  assert.equal(monthCloseSchema.safeParse({ month: 13, year: 2026 }).success, false);
  assert.equal(monthCloseSchema.safeParse({ month: 0, year: 2026 }).success, false);
});

test('rejeita senha curta no cadastro', () => {
  const parsed = registerSchema.safeParse({
    name: 'Gabriel',
    email: 'gabriel@example.com',
    password: '123',
  });
  assert.equal(parsed.success, false);
});
