import { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, Download, Inbox } from 'lucide-react';
import type { Transaction } from '../types/types';
import InlineEdit from './InlineEdit';
import { exportToCsv } from '../utils/exportCsv';
import { formatPriceShort } from '../utils/formatPrice';

type TimeFilter = 'day' | 'month' | 'year';

type HistoryViewProps = {
  transactions: Transaction[];
  onUpdateTransaction: (
    id: string,
    updates: Partial<Omit<Transaction, 'id' | 'date'>>,
  ) => void;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  const time = d.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isToday) return `Hoy, ${time}`;
  if (isYesterday) return `Ayer, ${time}`;
  return (
    d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }) +
    `, ${time}`
  );
}

function getFilterStart(filter: TimeFilter): Date {
  const now = new Date();
  switch (filter) {
    case 'day':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case 'month':
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case 'year':
      return new Date(now.getFullYear(), 0, 1);
  }
}

function parseNumericInput(raw: string): number {
  const cleaned = raw.replace(/[^0-9.,]/g, '').replace(',', '.');
  const parsed = Number(cleaned);
  return !isNaN(parsed) && parsed > 0 ? parsed : 0;
}

const FILTER_OPTIONS: { id: TimeFilter; label: string }[] = [
  { id: 'day', label: 'Día' },
  { id: 'month', label: 'Mes' },
  { id: 'year', label: 'Año' },
];

export default function HistoryView({
  transactions,
  onUpdateTransaction,
}: HistoryViewProps) {
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('day');

  const filtered = useMemo(() => {
    const start = getFilterStart(activeFilter);
    return transactions.filter((t) => new Date(t.date) >= start);
  }, [transactions, activeFilter]);

  const totalIncome = useMemo(
    () =>
      filtered
        .filter((t) => t.type === 'ingreso')
        .reduce((sum, t) => sum + t.quantity * t.price, 0),
    [filtered],
  );

  const totalExpense = useMemo(
    () =>
      filtered
        .filter((t) => t.type === 'egreso')
        .reduce((sum, t) => sum + t.quantity * t.price, 0),
    [filtered],
  );

  function handleProductEdit(id: string, newProduct: string) {
    onUpdateTransaction(id, { product: newProduct });
  }

  function handleQuantityEdit(id: string, raw: string) {
    const value = parseNumericInput(raw);
    if (value > 0) onUpdateTransaction(id, { quantity: value });
  }

  function handlePriceEdit(id: string, raw: string) {
    const value = parseNumericInput(raw);
    if (value > 0) onUpdateTransaction(id, { price: value });
  }

  function handleExport() {
    const filterLabel =
      activeFilter === 'day'
        ? 'dia'
        : activeFilter === 'month'
          ? 'mes'
          : 'anio';
    exportToCsv(filtered, `xspotato_${filterLabel}.csv`);
  }

  return (
    <main className="max-w-7xl mx-auto px-5 pt-8 pb-32 md:pb-12">
      {/* Filters & Export */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveFilter(id)}
              className={`px-4 py-2 font-body text-base font-semibold rounded-full transition-colors ${
                activeFilter === id
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={handleExport}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 px-6 py-2 bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors rounded-xl font-body text-base font-semibold shadow-[0_4px_20px_rgba(0,0,0,0.05)] h-14 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Download size={20} />
          Exportar a CSV
        </button>
      </section>

      {/* Totals */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-surface-container-low flex flex-col">
          <span className="font-body text-base text-on-surface-variant mb-1">
            Total Ingresos
          </span>
          <div className="flex items-center gap-2">
            <ArrowUp className="text-primary-container" size={24} />
            <h2 className="font-display text-[32px] font-extrabold text-on-surface">
              $ {formatPriceShort(totalIncome)}
            </h2>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-surface-container-low flex flex-col">
          <span className="font-body text-base text-on-surface-variant mb-1">
            Total Egresos
          </span>
          <div className="flex items-center gap-2">
            <ArrowDown className="text-error" size={24} />
            <h2 className="font-display text-[32px] font-extrabold text-on-surface">
              $ {formatPriceShort(totalExpense)}
            </h2>
          </div>
        </div>
      </section>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
          <Inbox size={48} className="mb-4 opacity-40" />
          <p className="font-body text-lg">
            No hay movimientos en este período.
          </p>
          <p className="font-body text-sm mt-1">
            Probá cambiando el filtro o registrá un nuevo movimiento.
          </p>
        </div>
      )}

      {/* Desktop Table */}
      {filtered.length > 0 && (
        <section className="hidden md:block bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-surface-container-low overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="py-4 px-6 font-body text-base font-semibold text-on-surface-variant border-b border-surface-container">
                  Fecha
                </th>
                <th className="py-4 px-6 font-body text-base font-semibold text-on-surface-variant border-b border-surface-container">
                  Tipo
                </th>
                <th className="py-4 px-6 font-body text-base font-semibold text-on-surface-variant border-b border-surface-container">
                  Producto
                </th>
                <th className="py-4 px-6 font-body text-base font-semibold text-on-surface-variant border-b border-surface-container">
                  Cantidad
                </th>
                <th className="py-4 px-6 font-body text-base font-semibold text-on-surface-variant border-b border-surface-container">
                  P. Unit.
                </th>
                <th className="py-4 px-6 font-body text-base font-semibold text-on-surface-variant border-b border-surface-container">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="font-body text-base text-on-surface">
              {filtered.map((t) => {
                const isExpense = t.type === 'egreso';
                const total = t.quantity * t.price;
                return (
                  <tr
                    key={t.id}
                    className={`hover:bg-surface transition-colors border-b border-surface-container ${
                      isExpense ? 'bg-error-container/5' : ''
                    }`}
                  >
                    <td className="py-4 px-6">{formatDate(t.date)}</td>
                    <td className="py-4 px-6">
                      {isExpense ? (
                        <ArrowDown className="text-error" size={20} />
                      ) : (
                        <ArrowUp
                          className="text-primary-container"
                          size={20}
                        />
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <InlineEdit
                        value={t.product}
                        onCommit={(v) => handleProductEdit(t.id, v)}
                      />
                    </td>
                    <td className="py-4 px-6">
                      <InlineEdit
                        value={`${t.quantity}`}
                        onCommit={(v) => handleQuantityEdit(t.id, v)}
                      />
                      {' '}
                      {t.unit.toLowerCase()}
                    </td>
                    <td className="py-4 px-6">
                      <InlineEdit
                        value={`$ ${formatPriceShort(t.price)}`}
                        onCommit={(v) => handlePriceEdit(t.id, v)}
                      />
                    </td>
                    <td
                      className={`py-4 px-6 font-bold ${
                        isExpense ? 'text-error' : ''
                      }`}
                    >
                      {isExpense ? '- ' : ''}$ {formatPriceShort(total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {/* Mobile Cards */}
      {filtered.length > 0 && (
        <section className="md:hidden flex flex-col gap-4">
          {filtered.map((t) => {
            const isExpense = t.type === 'egreso';
            const total = t.quantity * t.price;
            return (
              <div
                key={t.id}
                className={`bg-surface-container-lowest p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-surface-container-low flex justify-between items-center ${
                  isExpense ? 'bg-error-container/5' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isExpense
                        ? 'bg-error-container/30'
                        : 'bg-primary-container/10'
                    }`}
                  >
                    {isExpense ? (
                      <ArrowDown className="text-error" size={20} />
                    ) : (
                      <ArrowUp
                        className="text-primary-container"
                        size={20}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <InlineEdit
                      value={t.product}
                      onCommit={(v) => handleProductEdit(t.id, v)}
                      className="font-body text-base font-semibold text-on-surface"
                    />
                    <span className="font-body text-sm text-on-surface-variant">
                      <InlineEdit
                        value={`${t.quantity}`}
                        onCommit={(v) => handleQuantityEdit(t.id, v)}
                        className="font-body text-sm text-on-surface-variant"
                      />
                      {' '}
                      {t.unit.toLowerCase()} × $
                      {' '}
                      <InlineEdit
                        value={`${formatPriceShort(t.price)}`}
                        onCommit={(v) => handlePriceEdit(t.id, v)}
                        className="font-body text-sm text-on-surface-variant"
                      />
                    </span>
                    <span className="font-body text-xs text-on-surface-variant">
                      {formatDate(t.date)}
                    </span>
                  </div>
                </div>
                <span
                  className={`font-display text-xl font-bold shrink-0 ${
                    isExpense ? 'text-error' : 'text-on-surface'
                  }`}
                >
                  {isExpense ? '- ' : ''}$ {formatPriceShort(total)}
                </span>
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
}
