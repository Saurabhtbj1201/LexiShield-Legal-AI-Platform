import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function DisclaimerBanner() {
  return (
    <Box
      sx={{
        backgroundColor: '#eef2ff',
        borderBottom: '1px solid #e0e7ff',
        py: 0.75,
        px: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        textAlign: 'center'
      }}
    >
      <InfoOutlinedIcon sx={{ fontSize: 16, color: '#4f46e5', flexShrink: 0 }} />
      <Typography variant="caption" sx={{ color: '#3730a3', fontSize: '0.75rem', lineHeight: 1.4, fontWeight: 500 }}>
        <strong style={{ color: '#1e1b4b' }}>Legal Information Notice:</strong> LexiShield provides educational
        document analysis and navigation assistance powered by GenAI. It is not formal legal counsel and does not create an attorney-client relationship.
      </Typography>
    </Box>
  );
}
