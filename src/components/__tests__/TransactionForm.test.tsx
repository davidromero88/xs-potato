import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TransactionForm from '../TransactionForm';
import type { Transaction } from '../../types/types';

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'ingreso',
    product: 'Huevo',
    quantity: 12,
    unit: 'Unidad',
    price: 80,
    date: '2024-01-15T10:00:00.000Z',
  },
  {
    id: '2',
    type: 'ingreso',
    product: 'Manzana',
    quantity: 5,
    unit: 'Kg',
    price: 150,
    date: '2024-01-14T10:00:00.000Z',
  },
];

const defaultProps = {
  variant: 'ingreso' as const,
  transactions: mockTransactions,
  onSave: vi.fn(),
  onBulkRename: vi.fn(),
  productSuggestions: ['Huevo', 'Manzana'],
};

function renderForm(overrides = {}) {
  const props = { ...defaultProps, ...overrides };
  return render(<TransactionForm {...props} />);
}

async function selectSuggestion(user: ReturnType<typeof userEvent.setup>, name: string) {
  const productInput = screen.getByPlaceholderText('Ej. Manzana');
  await user.click(productInput);
  await user.type(productInput, name.slice(0, 3));

  const suggestion = await screen.findByRole('button', { name });
  await user.click(suggestion);
}

function getUnitSelect(): HTMLSelectElement {
  // The only <select> in the form
  return document.querySelector('select') as HTMLSelectElement;
}

function getUnitPriceInput(): HTMLInputElement {
  // Unit price input has step="1", quantity has step="0.01"
  return document.querySelector('input[type="number"][step="1"]') as HTMLInputElement;
}

function getQuantityInput(): HTMLInputElement {
  // Quantity input has step="0.01"
  return document.querySelector('input[type="number"][step="0.01"]') as HTMLInputElement;
}

describe('TransactionForm - autocomplete unit auto-fill', () => {
  // Task 2.2: Selecting product with unit 'Unidad'
  it('auto-fills unit to Unidad and price when selecting a product with unit Unidad', async () => {
    const user = userEvent.setup();
    renderForm();

    await selectSuggestion(user, 'Huevo');

    expect(getUnitSelect().value).toBe('Unidad');
    expect(getUnitPriceInput().value).toBe('80');
  });

  // Task 2.3: Selecting product with unit 'Kg'
  it('auto-fills unit to Kg and price when selecting a product with unit Kg', async () => {
    const user = userEvent.setup();
    renderForm();

    await selectSuggestion(user, 'Manzana');

    expect(getUnitSelect().value).toBe('Kg');
    expect(getUnitPriceInput().value).toBe('150');
  });

  // Task 2.4: Product not in history
  it('leaves unit at Kg and price empty when typing a product not in history', async () => {
    const user = userEvent.setup();
    renderForm({ productSuggestions: ['Huevo', 'Manzana', 'Banana'] });

    const productInput = screen.getByPlaceholderText('Ej. Manzana');
    await user.click(productInput);
    await user.type(productInput, 'Banana');

    expect(getUnitSelect().value).toBe('Kg');
    expect(getUnitPriceInput().value).toBe('');
  });
});

describe('TransactionForm - preservation', () => {
  // Task 3.1: Form reset after autocomplete selection
  it('resets unit selector back to Kg after form submission', async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    renderForm({ onSave });

    // Select a product with unit 'Unidad'
    await selectSuggestion(user, 'Huevo');
    expect(getUnitSelect().value).toBe('Unidad');

    // Fill quantity
    await user.type(getQuantityInput(), '10');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Guardar Ingreso/i });
    await user.click(submitButton);

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(getUnitSelect().value).toBe('Kg');
  });

  // Task 3.2: RenameModal triggers on pencil edit
  it('triggers RenameModal when product name is edited via pencil icon and submitted', async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    renderForm({ onSave });

    // Select a product from autocomplete
    await selectSuggestion(user, 'Huevo');

    // Click the pencil icon to enable correcting mode
    const pencil = document.querySelector('svg.lucide-pencil')!.closest('button')!;
    await user.click(pencil);

    // Now in correcting mode — type additional text to change the name
    // Don't clear (clearing resets isCorrecting), just select all and type new name
    const productInput = screen.getByPlaceholderText('Ej. Manzana');
    // The input should be focused and we can select all text then type replacement
    await user.tripleClick(productInput);
    await user.keyboard('Huevo Orgánico');

    // Fill required fields
    await user.type(getQuantityInput(), '12');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Guardar Ingreso/i });
    await user.click(submitButton);

    // RenameModal should appear
    expect(screen.getByText(/¿Actualizar nombre\?/i)).toBeInTheDocument();
  });

  // Task 3.3: Manual unit change doesn't trigger RenameModal
  it('does not trigger RenameModal when only the unit is changed after autocomplete selection', async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    renderForm({ onSave });

    // Select a product from autocomplete (unit auto-fills to 'Unidad')
    await selectSuggestion(user, 'Huevo');
    expect(getUnitSelect().value).toBe('Unidad');

    // Manually change the unit to 'Kg'
    await user.selectOptions(getUnitSelect(), 'Kg');
    expect(getUnitSelect().value).toBe('Kg');

    // Fill required fields
    await user.type(getQuantityInput(), '5');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Guardar Ingreso/i });
    await user.click(submitButton);

    // RenameModal should NOT appear (product name was not changed)
    expect(screen.queryByText(/¿Actualizar nombre\?/i)).not.toBeInTheDocument();
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
