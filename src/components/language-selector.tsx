'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Languages } from 'lucide-react';

export type Language = {
  code: string;
  name: string;
  nativeName: string;
};

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
];

interface LanguageSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LanguageSelector({ 
  value, 
  onValueChange, 
  className = '',
  size = 'md'
}: LanguageSelectorProps) {
  const sizeClasses = {
    sm: 'w-28 h-8 text-xs',
    md: 'w-32 h-9 text-sm',
    lg: 'w-36 h-10 text-base'
  };

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`${sizeClasses[size]} ${className}`}>
        <Languages className="h-3 w-3 mr-1" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {supportedLanguages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code} className="text-sm">
            <span className="font-medium">{lang.nativeName}</span>
            <span className="text-muted-foreground ml-2">({lang.name})</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Utility functions for multilingual support
export const getLocalizedText = (textMap: Record<string, string>, languageCode: string): string => {
  return textMap[languageCode] || textMap['en'] || '';
};

export const createLanguagePrompt = (originalPrompt: string, languageCode: string): string => {
  if (languageCode === 'en') return originalPrompt;
  
  const languageNames = {
    hi: 'Hindi',
    te: 'Telugu', 
    ta: 'Tamil'
  };
  
  const languageName = languageNames[languageCode as keyof typeof languageNames];
  return `Please respond in ${languageName} language. ${originalPrompt}`;
};