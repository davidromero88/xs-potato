export type Transaction = {
  id: string;
  type: 'ingreso' | 'egreso';
  product: string;
  quantity: number;
  unit: 'Kg' | 'Unidad';
  price: number;
  date: string;
};
