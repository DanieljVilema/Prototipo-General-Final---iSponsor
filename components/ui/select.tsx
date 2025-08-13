'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

interface SelectContextType {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps {
  className?: string;
  children: ReactNode;
}

export function SelectTrigger({ className = '', children }: SelectTriggerProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectTrigger must be used within Select');

  return (
    <button
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
      <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

interface SelectValueProps {
  placeholder?: string;
}

export function SelectValue({ placeholder = 'Seleccionar...' }: SelectValueProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectValue must be used within Select');

  return <span className="text-gray-700">{context.value || placeholder}</span>;
}

interface SelectContentProps {
  className?: string;
  children: ReactNode;
}

export function SelectContent({ className = '', children }: SelectContentProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectContent must be used within Select');

  if (!context.open) return null;

  return (
    <div className={`absolute top-full left-0 z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-md border bg-white shadow-md ${className}`}>
      <div className="p-1">
        {children}
      </div>
    </div>
  );
}

interface SelectItemProps {
  value: string;
  className?: string;
  children: ReactNode;
}

export function SelectItem({ value, className = '', children }: SelectItemProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectItem must be used within Select');

  const handleClick = () => {
    context.onValueChange?.(value);
    context.setOpen(false);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
    >
      {context.value === value && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </span>
      )}
      {children}
    </div>
  );
}
