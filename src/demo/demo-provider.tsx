'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useDemoStore } from './use-demo-store';

const DemoContext = createContext<ReturnType<typeof useDemoStore> | null>(null);

interface DemoProviderProps {
  children: ReactNode;
}

export function DemoProvider({ children }: DemoProviderProps) {
  const store = useDemoStore();

  return (
    <DemoContext.Provider value={store}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
