import { PlusCircle, MinusCircle, History } from 'lucide-react';
import type { Tab } from '../types/tabs';

type BottomNavProps = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

const tabs: { id: Tab; label: string; Icon: typeof PlusCircle }[] = [
  { id: 'ingresos', label: 'Ingresos', Icon: PlusCircle },
  { id: 'egresos', label: 'Egresos', Icon: MinusCircle },
  { id: 'historial', label: 'Historial', Icon: History },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-white/90 backdrop-blur-md rounded-t-3xl border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      {tabs.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center justify-center px-6 py-2 rounded-2xl transition-all ${
              isActive
                ? 'bg-primary-container/10 text-primary-container scale-90'
                : 'text-gray-400'
            }`}
          >
            <Icon className="mb-1" size={24} fill={isActive ? 'currentColor' : 'none'} />
            <span className="font-display text-[12px] font-bold uppercase tracking-wider">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
