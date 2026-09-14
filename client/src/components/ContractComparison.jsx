import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Chip,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  CircularProgress
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShieldAlertIcon from '@mui/icons-material/Security';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function ContractComparison({ comparisonData, onRunComparison, isLoading }) {
  const [versionA, setVersionA] = useState('');
  const [versionB, setVersionB] = useState('');

  const handleManualCompare = (e) => {
    e.preventDefault();
    if (!versionA.trim() || !versionB.trim()) return;
    onRunComparison(versionA, versionB);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {comparisonData ? (
        <>
          {/* Header Summary & Delta Gauge Card */}
          <Card sx={{ p: 3, backgroundColor: '#ffffff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
              <CompareArrowsIcon sx={{ color: '#4f46e5', fontSize: 24 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Contract Version Redline & Risk Comparison
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.6, mb: 3 }}>
              {comparisonData.summaryOfChanges}
            </Typography>

            {/* Risk Delta Banner */}
            {comparisonData.riskDelta && (
              <Paper
                sx={{
                  p: 2.5,
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block' }}>
                      VERSION 1.0 (INITIAL)
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#0284c7', display: 'inline' }}>
                      {comparisonData.riskDelta.v1Score}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', ml: 0.5 }}>
                      /100
                    </Typography>
                  </Box>

                  <ArrowForwardIcon sx={{ color: '#94a3b8', fontSize: 22 }} />

                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block' }}>
                      VERSION 2.0 (REVISED)
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#e11d48', display: 'inline' }}>
                      {comparisonData.riskDelta.v2Score}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', ml: 0.5 }}>
                      /100
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ maxWidth: 500 }}>
                  <Chip
                    icon={<TrendingUpIcon sx={{ fontSize: 14, color: '#be123c !important' }} />}
                    label={`Risk Shift: ${comparisonData.riskDelta.changeDirection} (+${
                      comparisonData.riskDelta.v2Score - comparisonData.riskDelta.v1Score
                    } points)`}
                    size="small"
                    sx={{
                      backgroundColor: '#ffe4e6',
                      border: '1px solid #fecdd3',
                      color: '#be123c',
                      fontWeight: 700,
                      mb: 0.75
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                    {comparisonData.riskDelta.explanation}
                  </Typography>
                </Box>
              </Paper>
            )}
          </Card>

          {/* Key Alterations & Diff Clauses */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ShieldAlertIcon sx={{ color: '#e11d48', fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                Key Alterations & Sneaky Changes Detected
              </Typography>
            </Box>

            <Stack spacing={2}>
              {comparisonData.diffClauses?.map((diff, idx) => (
                <Card key={idx} sx={{ p: 2.5, backgroundColor: '#ffffff' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      {diff.clauseName}
                    </Typography>
                    <Chip
                      label={`${diff.severity} Impact`}
                      size="small"
                      sx={{
                        backgroundColor:
                          diff.severity?.toLowerCase() === 'critical' ? '#ffe4e6' : '#fef3c7',
                        color:
                          diff.severity?.toLowerCase() === 'critical' ? '#be123c' : '#b45309',
                        border: '1px solid #e2e8f0',
                        fontWeight: 700
                      }}
                    />
                  </Box>

                  <Typography variant="body2" sx={{ color: '#be123c', mb: 2, fontSize: '0.875rem' }}>
                    <strong>Practical Effect: </strong> {diff.impact}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: '#fff1f2',
                          border: '1px solid #fecdd3',
                          borderRadius: 2
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ textTransform: 'uppercase', color: '#9f1239', fontWeight: 700, display: 'block', mb: 0.5 }}
                        >
                          Version 1.0 (Original / Prior):
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8rem', color: '#881337' }}
                        >
                          "{diff.v1Snippet}"
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: 2
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ textTransform: 'uppercase', color: '#15803d', fontWeight: 700, display: 'block', mb: 0.5 }}
                        >
                          Version 2.0 (Revised / Proposed):
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8rem', color: '#14532d' }}
                        >
                          "{diff.v2Snippet}"
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Stack>
          </Box>

          {/* Strategic Negotiation Advice */}
          {comparisonData.negotiationAdvice && (
            <Card sx={{ p: 3, backgroundColor: '#ffffff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CheckCircleOutlineIcon sx={{ color: '#059669', fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  Recommended Counter-Negotiation Strategy
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontSize: '0.85rem' }}>
                Use these firm talking points before signing the amended version:
              </Typography>

              <List dense disablePadding>
                {comparisonData.negotiationAdvice.map((tip, idx) => (
                  <ListItem key={idx} disableGutters sx={{ py: 0.75, alignItems: 'flex-start' }}>
                    <ListItemIcon sx={{ minWidth: 24, mt: 0.25 }}>
                      <Typography sx={{ color: '#4f46e5', fontWeight: 700 }}>•</Typography>
                    </ListItemIcon>
                    <ListItemText
                      primary={tip}
                      primaryTypographyProps={{ sx: { fontSize: '0.875rem', color: '#334155' } }}
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          )}
        </>
      ) : (
        /* Manual Comparison Form */
        <Card sx={{ p: 4, backgroundColor: '#ffffff' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, textAlign: 'center', mb: 1, color: '#0f172a' }}>
            Compare Two Contracts or Versions Side-by-Side
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', mb: 4, maxWidth: 620, mx: 'auto' }}>
            Paste the initial draft and the counterparty's revised agreement to uncover risk shifts.
          </Typography>

          <form onSubmit={handleManualCompare}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 1 }}>
                  VERSION 1.0 (ORIGINAL / PRIOR DRAFT)
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={9}
                  placeholder="Paste Version 1 text or initial offer terms here..."
                  value={versionA}
                  onChange={(e) => setVersionA(e.target.value)}
                  sx={{ '& .MuiInputBase-root': { fontFamily: '"JetBrains Mono", monospace', fontSize: '0.825rem', backgroundColor: '#f8fafc' } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 1 }}>
                  VERSION 2.0 (REVISED / AMENDED DRAFT)
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={9}
                  placeholder="Paste Version 2 text or revised contract terms here..."
                  value={versionB}
                  onChange={(e) => setVersionB(e.target.value)}
                  sx={{ '& .MuiInputBase-root': { fontFamily: '"JetBrains Mono", monospace', fontSize: '0.825rem', backgroundColor: '#f8fafc' } }}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={!versionA.trim() || !versionB.trim() || isLoading}
                startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <CompareArrowsIcon />}
              >
                {isLoading ? 'Analyzing Redline Diff...' : 'Generate Redline & Risk Comparison'}
              </Button>
            </Box>
          </form>
        </Card>
      )}
    </Box>
  );
}
