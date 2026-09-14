import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5', // Deep rich indigo
      light: '#6366f1',
      dark: '#3730a3',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#0891b2', // Vibrant teal/cyan
      light: '#06b6d4',
      dark: '#0e7490',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff'
    },
    text: {
      primary: '#0f172a', // Slate 900
      secondary: '#475569' // Slate 600
    },
    error: {
      main: '#e11d48',
      light: '#ffe4e6',
      dark: '#be123c'
    },
    warning: {
      main: '#d97706',
      light: '#fef3c7',
      dark: '#b45309'
    },
    success: {
      main: '#059669',
      light: '#d1fae5',
      dark: '#047857'
    },
    divider: '#e2e8f0'
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
    h1: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 800,
      letterSpacing: '-0.025em',
      color: '#0f172a'
    },
    h2: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      color: '#0f172a'
    },
    h3: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.015em',
      color: '#0f172a'
    },
    h4: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
      color: '#0f172a'
    },
    h5: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
      color: '#0f172a'
    },
    h6: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
      color: '#0f172a'
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em'
    }
  },
  shape: {
    borderRadius: 10
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f8fafc',
          backgroundImage:
            'radial-gradient(at 15% 10%, rgba(99, 102, 241, 0.08) 0px, transparent 50%), radial-gradient(at 85% 15%, rgba(6, 182, 212, 0.08) 0px, transparent 50%), radial-gradient(at 50% 90%, rgba(16, 185, 129, 0.05) 0px, transparent 50%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          color: '#0f172a'
        }
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02)'
        }
      }
    },
    MuiCard: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': {
            boxShadow: '0 12px 24px -4px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.03)'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 18px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4338ca 0%, #3730a3 100%)',
            boxShadow: '0 6px 16px rgba(79, 70, 229, 0.35)'
          }
        },
        outlined: {
          borderColor: '#cbd5e1',
          color: '#334155',
          backgroundColor: '#ffffff',
          '&:hover': {
            borderColor: '#94a3b8',
            backgroundColor: '#f8fafc'
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.925rem',
          minHeight: 48,
          color: '#64748b',
          '&.Mui-selected': {
            color: '#4f46e5'
          }
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
          background: 'linear-gradient(90deg, #4f46e5, #0891b2)'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 8,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#cbd5e1'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#94a3b8'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4f46e5',
            borderWidth: 1.5
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 14,
          boxShadow: '0 20px 40px -8px rgba(15, 23, 42, 0.15)'
        }
      }
    }
  }
});

export default theme;
