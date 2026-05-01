import { useState, useCallback } from 'react';
import type { Transaction } from '../types/types';

const STORAGE_KEY = 'xs-potato_history';

type NewTransaction = Omit<Transaction, 'id' | 'date'>;

function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function normalizeProductName(raw: string, existing: Transaction[]): string {
  const trimmed = raw.trim();
  if (trimmed === '') return trimmed;

  const lowered = trimmed.toLowerCase();
  const match = existing.find((t) => t.product.toLowerCase() === lowered);

  if (match) return match.product;

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions);

  const persist = useCallback((next: Transaction[]) => {
    setTransactions(next);
    saveTransactions(next);
  }, []);

  const addTransaction = useCallback((data: NewTransaction) => {
    const current = loadTransactions();
    const product = normalizeProductName(data.product, current);

    const entry: Transaction = {
      ...data,
      product,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    const next = [entry, ...current];
    persist(next);
  }, [persist]);

  const updateTransactionById = useCallback(
    (id: string, updates: Partial<Omit<Transaction, 'id' | 'date'>>) => {
      const current = loadTransactions();
      const next = current.map((t) =>
        t.id === id ? { ...t, ...updates } : t,
      );
      persist(next);
    },
    [persist],
  );

  const bulkUpdateProductName = useCallback(
    (oldName: string, newName: string) => {
      const current = loadTransactions();
      const next = current.map((t) =>
        t.product === oldName ? { ...t, product: newName } : t,
      );
      persist(next);
    },
    [persist],
  );

  return {
    transactions,
    addTransaction,
    updateTransactionById,
    bulkUpdateProductName,
  } as const;
}
