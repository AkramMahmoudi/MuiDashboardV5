import 'src/global.css';

import Fab from '@mui/material/Fab';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { Iconify } from 'src/components/iconify';
import { useEffect } from 'react';
import axios from 'axios';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();
  useEffect(() => {
    axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }, []);

  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
