import { useState } from 'react';
import type { Transaction } from '../types/types';

type NewTransaction = Omit<Transaction, 'id' | 'date'>;

type UseTransactionFormOptions = {
  variant: 'ingreso' | 'egreso';
};

export function useTransactionForm({ variant }: UseTransactionFormOptions) {
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<'Kg' | 'Unidad'>('Kg');
  const [unitPrice, setUnitPrice] = useState('');

  const total =
    Number(quantity) > 0 && Number(unitPrice) > 0
      ? Number(quantity) * Number(unitPrice)
      : 0;

  function buildTransaction(product: string): NewTransaction | null {
    const trimmed = product.trim();
    if (trimmed === '' || Number(quantity) <= 0 || Number(unitPrice) <= 0) {
      return null;
    }

    return {
      type: variant,
      product: trimmed,
      quantity: Number(quantity),
      unit,
      price: Number(unitPrice),
    };
  }

  function canSubmit(product: string): boolean {
    return (
      product.trim() !== '' && Number(quantity) > 0 && Number(unitPrice) > 0
    );
  }

  function resetFields() {
    setQuantity('');
    setUnit('Kg');
    setUnitPrice('');
  }

  return {
    quantity,
    setQuantity,
    unit,
    setUnit,
    unitPrice,
    setUnitPrice,
    total,
    canSubmit,
    buildTransaction,
    resetFields,
  } as const;
}
