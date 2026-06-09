import { useEffect, useMemo } from 'react';
import { useTheme as useCustomTheme } from './hooks/useLocalStorage';
import { FilterBar, PolicyTable, StatsPanel } from './features/policies/components/index';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  useMediaQuery,
} from '@mui/material';
import { Brightness4 as DarkIcon, Brightness7 as LightIcon } from '@mui/icons-material';

/**
 * App Component
 * Main application layout with Material-UI theme provider.
 */
export default function App() {
  const { isDark, toggleTheme } = useCustomTheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Create MUI theme based on dark mode preference
  const theme = useMemo(() => createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: '#2563eb',
        light: '#3b82f6',
        dark: '#1d4ed8',
      },
      secondary: {
        main: '#f59e0b',
      },
      success: {
        main: '#10b981',
      },
      error: {
        main: '#ef4444',
      },
      warning: {
        main: '#f59e0b',
      },
      info: {
        main: '#3b82f6',
        lighter: 'rgba(59, 130, 246, 0.1)',
        light: 'rgba(59, 130, 246, 0.3)',
      },
      background: {
        default: isDark ? '#0f172a' : '#f9fafb',
        paper: isDark ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f1f5f9' : '#1f2937',
        secondary: isDark ? '#cbd5e1' : '#6b7280',
      },
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h6: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
      },
      subtitle2: {
        fontSize: '0.9rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: '0.95rem',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '16px',
          },
        },
      },
    },
  }), [isDark]);

  // Update DOM class for dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
        <AppBar position="static" sx={{ boxShadow: 1 }}>
          <Toolbar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
                📊 Policy Dashboard
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Chubb APAC Policy Overview
              </Typography>
            </Box>

            {/* Theme Toggle */}
            <Button
              variant="outlined"
              size="small"
              onClick={toggleTheme}
              startIcon={isDark ? <LightIcon /> : <DarkIcon />}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              {isDark ? 'Light' : 'Dark'}
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
          {/* Statistics Panel */}
          <StatsPanel />

          {/* Filter Bar */}
          <FilterBar />

          {/* Policy Table */}
          <PolicyTable />
        </Container>

        {/* Footer */}
        <Box component="footer" sx={{ py: 3, px: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Container maxWidth="lg">
            <Typography variant="caption" align="center" display="block">
              © 2024 Chubb Limited. Policy Dashboard v1.0 | React 18 + Material-UI + TanStack Query
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
