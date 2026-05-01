import type { Transaction } from '../types/types';

function formatDateForCsv(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function exportToCsv(transactions: Transaction[], filename: string): void {
  const header = '"Fecha","Tipo","Producto","Cantidad","Unidad","Precio Unitario","Total"\n';

  const rows = transactions.map((t) => {
    const date = formatDateForCsv(t.date);
    const type = t.type === 'ingreso' ? 'Ingreso' : 'Egreso';
    const product = t.product.replace(/"/g, '""');
    const total = t.quantity * t.price;
    return `"${date}","${type}","${product}",${t.quantity},"${t.unit}",${t.price},${total}`;
  });

  const csv = header + rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
