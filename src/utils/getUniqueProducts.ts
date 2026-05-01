import type { Transaction } from '../types/types';

export function getUniqueProducts(transactions: Transaction[]): string[] {
  const seen = new Set<string>();
  for (const t of transactions) {
    seen.add(t.product);
  }
  return Array.from(seen).sort((a, b) =>
    a.localeCompare(b, 'es', { sensitivity: 'base' }),
  );
}
