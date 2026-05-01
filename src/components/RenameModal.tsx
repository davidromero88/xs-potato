import { RefreshCw, X } from 'lucide-react';

type RenameModalProps = {
  oldName: string;
  newName: string;
  onCancel: () => void;
  onThisTimeOnly: () => void;
  onUpdateAll: () => void;
};

export default function RenameModal({
  oldName,
  newName,
  onCancel,
  onThisTimeOnly,
  onUpdateAll,
}: RenameModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-t-[32px] md:rounded-3xl p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col gap-6 animate-[slideUp_0.2s_ease-out]">
        {/* Handle (mobile) */}
        <div className="w-12 h-1.5 bg-surface-container-highest rounded-full mx-auto md:hidden" />

        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container-high transition-colors"
          aria-label="Cancelar"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col gap-2 text-center">
          <RefreshCw
            className="mx-auto mb-2 text-tertiary-container"
            size={36}
          />
          <h3 className="font-display text-[22px] font-bold text-on-surface">
            ¿Actualizar nombre?
          </h3>
          <p className="font-body text-base text-on-surface-variant">
            Cambiaste <strong>'{oldName}'</strong> por{' '}
            <strong>'{newName}'</strong>. ¿Querés actualizar este nombre en
            todos los registros anteriores también?
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <button
            onClick={onUpdateAll}
            className="w-full h-14 bg-primary-container text-on-primary-container rounded-full font-body text-base font-bold transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Actualizar en todo el historial
          </button>
          <button
            onClick={onThisTimeOnly}
            className="w-full h-14 bg-transparent border-2 border-surface-container-highest text-on-surface rounded-full font-body text-base font-bold transition-all hover:bg-surface-container-high active:scale-[0.98]"
          >
            Solo esta vez
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 text-on-surface-variant font-body text-base font-semibold hover:text-on-surface transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
