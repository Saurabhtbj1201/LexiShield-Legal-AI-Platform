import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Chip,
  Tooltip,
  IconButton,
  Container
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import RefreshIcon from '@mui/icons-material/Refresh';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

export default function Navbar({ onOpenApiKeyModal, onOpenArchitectureModal, apiKey, onReset, activeContractTitle }) {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 10px -2px rgba(15, 23, 42, 0.05)',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 64, display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo & Brand */}
          <Box
            onClick={onReset}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #4f46e5 0%, #0891b2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
              }}
            >
              <GavelIcon sx={{ color: '#ffffff', fontSize: 20 }} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #0f172a 40%, #334155 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                LexiShield
              </Typography>
              <Chip
                label="GenAI 2.0"
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.675rem',
                  fontWeight: 700,
                  backgroundColor: 'rgba(79, 70, 229, 0.08)',
                  color: '#4f46e5',
                  border: '1px solid rgba(79, 70, 229, 0.2)'
                }}
              />
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            {activeContractTitle && (
              <Chip
                icon={<DescriptionIcon sx={{ fontSize: 16, color: '#4f46e5 !important' }} />}
                label={activeContractTitle}
                variant="outlined"
                sx={{
                  maxWidth: 240,
                  borderColor: '#cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  fontSize: '0.8rem',
                  display: { xs: 'none', md: 'inline-flex' }
                }}
              />
            )}

            <Tooltip title="View GenAI Architecture & Evaluator Calibration Hub">
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={onOpenArchitectureModal}
                startIcon={<AccountTreeIcon sx={{ fontSize: 16 }} />}
                sx={{
                  borderRadius: 1.5,
                  fontSize: '0.825rem',
                  px: 1.5,
                  py: 0.75,
                  background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                  boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)'
                }}
                aria-label="Open GenAI Architecture and Evaluator Hub"
              >
                Evaluator Hub
              </Button>
            </Tooltip>

            <Tooltip title="Configure Gemini API Key (Offline fallback available)">
              <Button
                variant="outlined"
                size="small"
                onClick={onOpenApiKeyModal}
                startIcon={<VpnKeyIcon sx={{ fontSize: 16, color: '#4f46e5' }} />}
                endIcon={
                  apiKey ? (
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        backgroundColor: '#059669',
                        boxShadow: '0 0 6px #059669'
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        backgroundColor: '#4f46e5'
                      }}
                    />
                  )
                }
                sx={{
                  borderRadius: 1.5,
                  fontSize: '0.825rem',
                  px: 1.5,
                  py: 0.75
                }}
              >
                API Key
              </Button>
            </Tooltip>

            {activeContractTitle && (
              <Tooltip title="Start over with a new contract">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={onReset}
                  startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    borderRadius: 1.5,
                    fontSize: '0.825rem',
                    px: 1.5,
                    py: 0.75
                  }}
                >
                  New Document
                </Button>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
