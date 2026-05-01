import { useState, useRef, useEffect } from 'react';

type InlineEditProps = {
  value: string;
  onCommit: (newValue: string) => void;
  className?: string;
  inputClassName?: string;
};

export default function InlineEdit({
  value,
  onCommit,
  className = '',
  inputClassName = '',
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function startEditing() {
    setDraft(value);
    setEditing(true);
  }

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) {
      onCommit(trimmed);
    }
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      commit();
    } else if (e.key === 'Escape') {
      setEditing(false);
    }
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className={`bg-surface-container-low rounded-lg px-2 py-1 border border-outline-variant font-body text-base text-on-surface outline-none focus:ring-2 focus:ring-primary-container ${inputClassName}`}
      />
    );
  }

  return (
    <span
      onClick={startEditing}
      className={`border-b border-dashed border-outline-variant cursor-pointer hover:border-primary-container hover:text-primary-container transition-colors ${className}`}
    >
      {value}
    </span>
  );
}
