import { useState } from 'react';
import type { Tab } from './types/tabs';
import { useTransactions } from './hooks/useTransactions';
import { getUniqueProducts } from './utils/getUniqueProducts';
import TopNav from './components/TopNav';
import BottomNav from './components/BottomNav';
import TransactionForm from './components/TransactionForm';
import HistoryView from './components/HistoryView';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('ingresos');
  const {
    transactions,
    addTransaction,
    updateTransactionById,
    bulkUpdateProductName,
  } = useTransactions();
  const productSuggestions = getUniqueProducts(transactions);

  return (
    <div className="min-h-screen bg-[#F8FAF8] font-body text-on-surface antialiased">
      <TopNav activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'ingresos' && (
        <TransactionForm
          variant="ingreso"
          transactions={transactions}
          onSave={addTransaction}
          onBulkRename={bulkUpdateProductName}
          productSuggestions={productSuggestions}
        />
      )}
      {activeTab === 'egresos' && (
        <TransactionForm
          variant="egreso"
          transactions={transactions}
          onSave={addTransaction}
          onBulkRename={bulkUpdateProductName}
          productSuggestions={productSuggestions}
        />
      )}
      {activeTab === 'historial' && (
        <HistoryView
          transactions={transactions}
          onUpdateTransaction={updateTransactionById}
        />
      )}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
