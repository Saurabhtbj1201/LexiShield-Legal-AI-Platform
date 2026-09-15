import React from 'react';
import { Box, Container, Paper, Typography, Button } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import RefreshIcon from '@mui/icons-material/Refresh';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('LexiShield React Error Boundary Caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'error.light',
              bgcolor: '#fff5f5'
            }}
            role="alert"
            aria-live="assertive"
          >
            <WarningAmberIcon sx={{ fontSize: 56, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={700} gutterBottom color="text.primary">
              Something went wrong while rendering this legal view
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
              LexiShield caught an unexpected component error. Your data and API keys stored in local storage remain safe.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={this.handleReset}
              sx={{ px: 3, py: 1, borderRadius: 2 }}
            >
              Reload Platform
            </Button>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}
