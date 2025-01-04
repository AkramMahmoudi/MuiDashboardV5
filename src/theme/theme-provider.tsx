import type {} from '@mui/lab/themeAugmentation';
import type {} from '@mui/material/themeCssVarsAugmentation';

import { useEffect, useState } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { CacheProvider } from '@emotion/react';
import { createTheme, createEmotionCache } from './create-theme';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const { i18n } = useTranslation();
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    // Update direction based on the current language
    const langDirection = i18n.language === 'ar' ? 'rtl' : 'ltr';
    setDirection(langDirection);
    document.body.dir = langDirection; // Set HTML body direction
  }, [i18n.language]);

  const theme = createTheme();
  const cache = createEmotionCache(direction);
  return (
    <CacheProvider value={cache}>
      <CssVarsProvider theme={theme}>
        <CssBaseline />
        {children}
      </CssVarsProvider>
    </CacheProvider>
  );
}
