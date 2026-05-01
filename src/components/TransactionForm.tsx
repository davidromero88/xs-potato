import { ShoppingBag, PlusCircle, CheckCircle, Pencil } from 'lucide-react';
import type { Transaction } from '../types/types';
import { useProductAutocomplete } from '../hooks/useProductAutocomplete';
import { useTransactionForm } from '../hooks/useTransactionForm';
import { formatPrice } from '../utils/formatPrice';
import RenameModal from './RenameModal';

type NewTransaction = Omit<Transaction, 'id' | 'date'>;

type TransactionFormProps = {
  variant: 'ingreso' | 'egreso';
  transactions: Transaction[];
  onSave: (data: NewTransaction) => void;
  onBulkRename: (oldName: string, newName: string) => void;
  productSuggestions: string[];
};

export default function TransactionForm({
  variant,
  transactions,
  onSave,
  onBulkRename,
  productSuggestions,
}: TransactionFormProps) {
  const isIncome = variant === 'ingreso';

  const form = useTransactionForm({ variant });

  function handleSuggestionSelected(name: string) {
    const lastMatch = transactions.find((t) => t.product === name);
    if (lastMatch) {
      form.setUnitPrice(String(lastMatch.price));
    }
  }

  const { state: ac, refs } = useProductAutocomplete({
    suggestions: productSuggestions,
    onSuggestionSelected: handleSuggestionSelected,
  });
  const { dropdownRef, inputRef } = refs;

  const ready = form.canSubmit(ac.product);

  function handleSubmit() {
    const data = form.buildTransaction(ac.product);
    if (!data) return;

    const rename = ac.checkForRename(data);
    if (rename) return;

    onSave(data);
    form.resetFields();
    ac.resetAutocomplete();
  }

  function handleCancelRename() {
    ac.clearPendingRename();
  }

  function handleThisTimeOnly() {
    if (!ac.pendingRename) return;
    onSave(ac.pendingRename.data);
    ac.clearPendingRename();
    form.resetFields();
    ac.resetAutocomplete();
  }

  function handleUpdateAll() {
    if (!ac.pendingRename) return;
    onBulkRename(ac.pendingRename.oldName, ac.pendingRename.newName);
    onSave(ac.pendingRename.data);
    ac.clearPendingRename();
    form.resetFields();
    ac.resetAutocomplete();
  }

  // Theme tokens
  const accentText = isIncome ? 'text-primary-container' : 'text-secondary';
  const accentBg = isIncome ? 'bg-primary-container' : 'bg-secondary';
  const accentRing = isIncome
    ? 'focus:ring-primary-container'
    : 'focus:ring-secondary';
  const correctingRing =
    'focus:ring-tertiary-container ring-2 ring-tertiary-container';
  const totalBg = isIncome
    ? 'bg-primary-container/5 border-primary-container/10'
    : 'bg-error-container/20 border-secondary/10';
  const buttonShadow = isIncome
    ? 'shadow-[0_8px_20px_rgba(40,199,111,0.25)]'
    : 'shadow-[0_8px_20px_rgba(183,20,34,0.2)]';
  const productInputRing = ac.isCorrecting
    ? correctingRing
    : `${accentRing} focus:ring-2`;

  const title = isIncome ? 'Registrar Ingreso' : 'Registrar Egreso';
  const subtitle = isIncome
    ? 'Añadí un nuevo lote de mercadería al inventario.'
    : 'Añade una nueva compra o gasto al sistema.';
  const buttonLabel = isIncome ? 'Guardar Ingreso' : 'Guardar Egreso';

  return (
    <>
      <main className="max-w-2xl mx-auto px-5 pt-8 md:pt-12 flex flex-col gap-8 pb-32 md:pb-12">
        <header className="flex flex-col gap-2">
          <h1
            className={`font-display text-4xl font-extrabold ${accentText} md:text-[40px] md:leading-[48px]`}
          >
            {title}
          </h1>
          <p className="font-body text-lg text-on-surface-variant">
            {subtitle}
          </p>
        </header>

        <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-8">
          {/* Product with autocomplete */}
          <div className="flex flex-col gap-2" ref={dropdownRef}>
            <label className="font-body text-base font-semibold text-on-surface-variant">
              Producto
            </label>
            {ac.isCorrecting && (
              <span className="font-body text-sm text-tertiary">
                Corrigiendo nombre…
              </span>
            )}
            <div className="relative flex items-center">
              <ShoppingBag
                className={`absolute left-4 ${ac.isCorrecting ? 'text-tertiary-container' : 'text-outline'}`}
                size={20}
              />
              <input
                ref={inputRef}
                type="text"
                placeholder="Ej. Manzana"
                value={ac.product}
                onChange={(e) => ac.handleProductChange(e.target.value)}
                onFocus={ac.handleFocus}
                onKeyDown={ac.handleKeyDown}
                onBlur={ac.handleBlur}
                className={`w-full h-14 pl-12 ${
                  ac.selectedFromSuggestion ? 'pr-12' : 'pr-4'
                } rounded-xl bg-surface-container-low border-none font-body text-lg text-on-surface ${productInputRing} transition-all outline-none`}
              />
              {ac.selectedFromSuggestion && (
                <button
                  type="button"
                  onClick={ac.handlePencilClick}
                  className={`absolute right-4 ${accentText} hover:opacity-70 p-1 rounded-full transition-colors`}
                >
                  <Pencil size={18} />
                </button>
              )}
            </div>

            {ac.showDropdown && ac.filtered.length > 0 && (
              <ul className="bg-surface-container-lowest rounded-xl border border-surface-container-low shadow-[0_12px_40px_rgba(0,0,0,0.1)] overflow-hidden mt-1 max-h-48 overflow-y-auto z-30">
                {ac.filtered.map((name) => (
                  <li key={name}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => ac.handleSelectSuggestion(name)}
                      className="w-full text-left px-4 py-3 font-body text-lg text-on-surface hover:bg-surface-container transition-colors"
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quantity & Unit */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col gap-2 flex-1">
              <label className="font-body text-base font-semibold text-on-surface-variant">
                Cantidad
              </label>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={form.quantity}
                onChange={(e) => form.setQuantity(e.target.value)}
                className={`w-full h-14 px-4 rounded-xl bg-surface-container-low border-none font-body text-lg text-on-surface ${accentRing} focus:ring-2 transition-all outline-none`}
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="font-body text-base font-semibold text-on-surface-variant">
                Unidad
              </label>
              <select
                value={form.unit}
                onChange={(e) =>
                  form.setUnit(e.target.value as 'Kg' | 'Unidad')
                }
                className={`w-full h-14 px-4 rounded-xl bg-surface-container-low border-none font-body text-lg text-on-surface ${accentRing} focus:ring-2 transition-all cursor-pointer appearance-none outline-none`}
              >
                <option value="Kg">Kg</option>
                <option value="Unidad">Unidad</option>
              </select>
            </div>
          </div>

          {/* Unit Price */}
          <div className="flex flex-col gap-2">
            <label className="font-body text-base font-semibold text-on-surface-variant">
              Precio Unitario
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 font-body text-lg text-on-surface-variant">
                $
              </span>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="1"
                value={form.unitPrice}
                onChange={(e) => form.setUnitPrice(e.target.value)}
                className={`w-full h-14 pl-10 pr-4 rounded-xl bg-surface-container-low border-none font-body text-lg text-on-surface ${accentRing} focus:ring-2 transition-all outline-none`}
              />
            </div>
          </div>

          {/* Computed Total (read-only) */}
          <div
            className={`flex flex-col gap-2 p-4 rounded-xl border ${totalBg}`}
          >
            <label className="font-body text-base font-semibold text-on-surface-variant">
              Costo Total
            </label>
            <div className="flex items-center gap-2">
              <span
                className={`font-display text-[32px] font-extrabold ${accentText}`}
              >
                $
              </span>
              <span className="font-display text-[32px] font-extrabold text-on-surface">
                {form.total > 0 ? formatPrice(form.total) : '0,00'}
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!ready}
            className={`w-full h-14 mt-2 ${accentBg} text-white rounded-full font-body text-lg font-bold tracking-wide ${buttonShadow} transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none`}
          >
            {isIncome ? (
              <PlusCircle size={22} />
            ) : (
              <CheckCircle size={22} />
            )}
            {buttonLabel}
          </button>
        </section>
      </main>

      {ac.pendingRename && (
        <RenameModal
          oldName={ac.pendingRename.oldName}
          newName={ac.pendingRename.newName}
          onCancel={handleCancelRename}
          onThisTimeOnly={handleThisTimeOnly}
          onUpdateAll={handleUpdateAll}
        />
      )}
    </>
  );
}
