import { useState, useEffect, useRef } from 'react';
import type { Transaction } from '../types/types';

type NewTransaction = Omit<Transaction, 'id' | 'date'>;

type PendingRename = {
  oldName: string;
  newName: string;
  data: NewTransaction;
};

type UseProductAutocompleteOptions = {
  suggestions: string[];
  onSuggestionSelected?: (name: string) => void;
};

export type ProductAutocompleteState = {
  product: string;
  showDropdown: boolean;
  selectedFromSuggestion: boolean;
  isCorrecting: boolean;
  filtered: string[];
  pendingRename: PendingRename | null;
  handleProductChange: (value: string) => void;
  handleSelectSuggestion: (name: string) => void;
  handlePencilClick: () => void;
  handleFocus: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleBlur: () => void;
  checkForRename: (data: NewTransaction) => PendingRename | null;
  clearPendingRename: () => void;
  resetAutocomplete: () => void;
};

export type ProductAutocompleteRefs = {
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

export function useProductAutocomplete({ suggestions, onSuggestionSelected }: UseProductAutocompleteOptions): {
  state: ProductAutocompleteState;
  refs: ProductAutocompleteRefs;
} {
  const [product, setProduct] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFromSuggestion, setSelectedFromSuggestion] = useState(false);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [originalName, setOriginalName] = useState('');
  const [pendingRename, setPendingRename] = useState<PendingRename | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered =
    product.trim().length > 0
      ? suggestions.filter((p) =>
          p.toLowerCase().includes(product.toLowerCase()),
        )
      : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleProductChange(value: string) {
    setProduct(value);

    if (value.trim() === '') {
      setIsCorrecting(false);
      setOriginalName('');
      setSelectedFromSuggestion(false);
    }

    if (!isCorrecting) {
      setShowDropdown(true);
    }
  }

  function handleSelectSuggestion(name: string) {
    setProduct(name);
    setOriginalName(name);
    setSelectedFromSuggestion(true);
    setIsCorrecting(false);
    setShowDropdown(false);
    onSuggestionSelected?.(name);
    inputRef.current?.focus();
  }

  function handlePencilClick() {
    setSelectedFromSuggestion(false);
    setIsCorrecting(true);
    inputRef.current?.focus();
  }

  function handleFocus() {
    if (!isCorrecting && product.trim().length > 0) {
      setShowDropdown(true);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Tab' || e.key === 'Escape') {
      setShowDropdown(false);
    }
  }

  function handleBlur() {
    // Small delay so suggestion onClick fires before dropdown hides
    setTimeout(() => setShowDropdown(false), 150);
  }

  function checkForRename(data: NewTransaction): PendingRename | null {
    const nameWasEdited =
      originalName !== '' && data.product !== originalName;

    if (nameWasEdited) {
      const rename: PendingRename = {
        oldName: originalName,
        newName: data.product,
        data,
      };
      setPendingRename(rename);
      return rename;
    }
    return null;
  }

  function clearPendingRename() {
    setPendingRename(null);
  }

  function resetAutocomplete() {
    setProduct('');
    setSelectedFromSuggestion(false);
    setIsCorrecting(false);
    setOriginalName('');
    setPendingRename(null);
  }

  return {
    state: {
      product,
      showDropdown: !isCorrecting && showDropdown,
      selectedFromSuggestion,
      isCorrecting,
      filtered,
      pendingRename,
      handleProductChange,
      handleSelectSuggestion,
      handlePencilClick,
      handleFocus,
      handleKeyDown,
      handleBlur,
      checkForRename,
      clearPendingRename,
      resetAutocomplete,
    },
    refs: {
      dropdownRef,
      inputRef,
    },
  };
}
