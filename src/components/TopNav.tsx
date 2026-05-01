import type { Tab } from '../types/tabs';

type TopNavProps = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

const tabs: { id: Tab; label: string }[] = [
  { id: 'ingresos', label: 'Ingresos' },
  { id: 'egresos', label: 'Egresos' },
  { id: 'historial', label: 'Historial' },
];

export default function TopNav({ activeTab, onTabChange }: TopNavProps) {
  return (
    <nav className="hidden md:flex flex-col w-full pt-4 px-5 bg-[#F8FAF8] border-b border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.05)] sticky top-0 z-40">
      <div className="flex justify-between items-center w-full mb-4">
        <span className="font-display text-2xl font-black text-primary-container tracking-tight">
          xs-potato
        </span>
      </div>
      <div className="flex gap-4 font-display text-base font-semibold tracking-tight">
        {tabs.map(({ id, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`px-4 py-2 transition-all ${
                isActive
                  ? 'text-primary-container border-b-4 border-primary-container'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-lg'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
