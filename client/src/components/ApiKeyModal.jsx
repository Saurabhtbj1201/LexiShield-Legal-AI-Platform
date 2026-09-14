import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Alert,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CheckIcon from '@mui/icons-material/Check';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';

export default function ApiKeyModal({ isOpen, onClose, apiKey, onSaveApiKey }) {
  const [tempKey, setTempKey] = useState(apiKey || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(tempKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setTempKey('');
    onSaveApiKey('');
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
          backgroundColor: '#ffffff',
          boxShadow: '0 20px 40px -8px rgba(15, 23, 42, 0.15)'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              backgroundColor: '#eef2ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4f46e5'
            }}
          >
            <VpnKeyIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a' }}>
            Gemini GenAI Configuration
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: '#64748b' }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5 }}>
        <Typography variant="body2" sx={{ color: '#475569', mb: 2.5, lineHeight: 1.6 }}>
          Optionally provide your Google Gemini API Key for direct cloud model inference. If left empty,
          LexiShield seamlessly utilizes its built-in <strong>High-Fidelity Legal Knowledge Engine</strong> so you can test all features offline with zero friction.
        </Typography>

        <TextField
          fullWidth
          type="password"
          label="Google Gemini API Key"
          placeholder="AIzaSy..."
          value={tempKey}
          onChange={(e) => setTempKey(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <VpnKeyIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
              </InputAdornment>
            )
          }}
          sx={{ mb: 2.5 }}
        />

        <Alert
          severity="info"
          icon={<ShieldOutlinedIcon sx={{ fontSize: 18 }} />}
          sx={{
            backgroundColor: '#eef2ff',
            border: '1px solid #c7d2fe',
            color: '#3730a3',
            fontSize: '0.8rem'
          }}
        >
          Your key is stored strictly inside your local browser storage and never transmitted to external logging servers.
        </Alert>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1 }}>
        {apiKey && (
          <Button variant="outlined" size="small" onClick={handleClear}>
            Clear Key
          </Button>
        )}
        <Button variant="outlined" size="small" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleSave}
          startIcon={saved ? <CheckIcon /> : <AutoAwesomeIcon />}
        >
          {saved ? 'Saved!' : 'Save & Apply'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
