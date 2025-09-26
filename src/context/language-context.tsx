'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize with undefined to avoid server-client mismatch
  const [language, setLanguage] = useState<Language>('tr'); 
  const [isInitial, setIsInitial] = useState(true);

  // This effect runs only on the client, after hydration
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    setIsInitial(false); // Mark that initial client-side setup is done
  }, []); // Empty dependency array ensures it runs once on mount

  // This effect synchronizes the language state with localStorage and document lang attribute
  useEffect(() => {
    // Only run this effect after the initial client-side setup
    if (!isInitial) {
      document.documentElement.lang = language;
      localStorage.setItem('language', language);
    }
  }, [language, isInitial]);

  const value = {
    language,
    setLanguage,
  };

  // Don't render children until the language has been determined on the client
  if (isInitial && typeof window !== 'undefined') {
    return null;
  }
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
