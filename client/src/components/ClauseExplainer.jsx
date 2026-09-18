import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Tooltip,
  Paper,
  Stack,
  Button
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import WhatshotIcon from '@mui/icons-material/Whatshot';

export default function ClauseExplainer({ flaggedClauses = [] }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'critical' | 'high'
  const [clauseTones, setClauseTones] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const getTone = (id) => clauseTones[id] || 'plain';

  const setTone = (id, tone) => {
    if (!tone) return;
    setClauseTones((prev) => ({ ...prev, [id]: tone }));
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filteredClauses = flaggedClauses.filter((clause) => {
    if (filter === 'critical') return clause.riskLevel === 'Critical';
    if (filter === 'high') return clause.riskLevel === 'High' || clause.riskLevel === 'Critical';
    return true;
  });

  const getSeverityStyles = (lvl) => {
    switch (lvl?.toLowerCase()) {
      case 'critical':
        return {
          borderLeft: '4px solid #e11d48',
          color: '#e11d48',
          bg: '#ffe4e6'
        };
      case 'high':
        return {
          borderLeft: '4px solid #d97706',
          color: '#d97706',
          bg: '#fef3c7'
        };
      default:
        return {
          borderLeft: '4px solid #4f46e5',
          color: '#4f46e5',
          bg: '#e0e7ff'
        };
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Header & Filter Controls */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, color: '#0f172a' }}>
            Flagged Legal Clauses & Explanations
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Unfair liabilities, predatory terms, and asymmetric risks translated into crystal-clear language.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Chip
            label={`All Clauses (${flaggedClauses.length})`}
            clickable
            variant={filter === 'all' ? 'filled' : 'outlined'}
            color={filter === 'all' ? 'primary' : 'default'}
            onClick={() => setFilter('all')}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            icon={<WhatshotIcon sx={{ fontSize: 14 }} />}
            label={`Critical Only (${flaggedClauses.filter((c) => c.riskLevel === 'Critical').length})`}
            clickable
            variant={filter === 'critical' ? 'filled' : 'outlined'}
            color={filter === 'critical' ? 'error' : 'default'}
            onClick={() => setFilter('critical')}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            icon={<WarningAmberIcon sx={{ fontSize: 14 }} />}
            label={`High & Critical (${flaggedClauses.filter((c) => c.riskLevel === 'High' || c.riskLevel === 'Critical').length})`}
            clickable
            variant={filter === 'high' ? 'filled' : 'outlined'}
            color={filter === 'high' ? 'warning' : 'default'}
            onClick={() => setFilter('high')}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Stack>
      </Box>

      {/* Clauses Cards List */}
      {filteredClauses.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center', color: '#64748b', backgroundColor: '#ffffff' }}>
          <Typography variant="body2">No clauses match the selected severity filter.</Typography>
        </Card>
      ) : (
        filteredClauses.map((clause) => {
          const currentTone = getTone(clause.id);
          const sev = getSeverityStyles(clause.riskLevel);

          return (
            <Card
              key={clause.id}
              sx={{
                p: 3,
                borderLeft: sev.borderLeft,
                backgroundColor: '#ffffff',
                '&:hover': {
                  borderColor: '#cbd5e1',
                  boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.08)'
                }
              }}
            >
              {/* Card Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>
                      {clause.clauseTitle}
                    </Typography>

                    {clause.isUnconscionable && (
                      <Chip
                        label="Potentially Unenforceable / Predatory"
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.675rem',
                          fontWeight: 700,
                          backgroundColor: '#ffe4e6',
                          color: '#be123c',
                          border: '1px solid #fecdd3'
                        }}
                      />
                    )}
                  </Box>

                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    CATEGORY: {clause.category?.toUpperCase()}
                  </Typography>
                </Box>

                <Chip
                  icon={
                    clause.riskLevel === 'Critical' ? (
                      <WhatshotIcon sx={{ fontSize: 14, color: `${sev.color} !important` }} />
                    ) : (
                      <WarningAmberIcon sx={{ fontSize: 14, color: `${sev.color} !important` }} />
                    )
                  }
                  label={`${clause.riskLevel} Risk`}
                  size="small"
                  sx={{
                    backgroundColor: sev.bg,
                    color: sev.color,
                    border: `1px solid ${sev.color}40`,
                    fontWeight: 700
                  }}
                />
              </Box>

              {/* Exact Snippet Box */}
              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 2
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: '#64748b' }}>
                    Contract Excerpt:
                  </Typography>
                  <Tooltip title={copiedId === `snippet-${clause.id}` ? 'Copied!' : 'Copy excerpt'}>
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(`snippet-${clause.id}`, clause.originalText)}
                      sx={{ color: '#64748b' }}
                      aria-label={`Copy excerpt for ${clause.clauseTitle}`}
                    >
                      {copiedId === `snippet-${clause.id}` ? (
                        <CheckIcon sx={{ fontSize: 15, color: '#059669' }} />
                      ) : (
                        <ContentCopyIcon sx={{ fontSize: 15 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.8rem',
                    color: '#334155',
                    lineHeight: 1.6
                  }}
                >
                  "{clause.originalText}"
                </Typography>
              </Paper>

              {/* Tone Selection Toggle */}
              <Box sx={{ mb: 2 }}>
                <ToggleButtonGroup
                  value={currentTone}
                  exclusive
                  onChange={(e, val) => setTone(clause.id, val)}
                  size="small"
                  aria-label={`Explanation style for ${clause.clauseTitle}`}
                  sx={{
                    backgroundColor: '#f1f5f9',
                    '& .MuiToggleButton-root': {
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      py: 0.5,
                      px: 1.5,
                      color: '#475569',
                      borderColor: '#e2e8f0',
                      '&.Mui-selected': {
                        backgroundColor: '#ffffff',
                        color: '#4f46e5',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }
                    }
                  }}
                >
                  <ToggleButton value="plain" aria-controls={`explainer-body-${clause.id}`} aria-label="Plain English explanation">
                    📖 Plain English
                  </ToggleButton>
                  <ToggleButton value="eli5" aria-controls={`explainer-body-${clause.id}`} aria-label="Explain Like I am 5 years old">
                    👶 Explain Like I'm 5
                  </ToggleButton>
                  <ToggleButton value="impact" aria-controls={`explainer-body-${clause.id}`} aria-label="Practical business and career impact">
                    💼 Practical Impact
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Explainer Body */}
              <Box id={`explainer-body-${clause.id}`} role="region" aria-live="polite" sx={{ mb: 2.5 }}>
                {currentTone === 'plain' && (
                  <Typography variant="body2" sx={{ color: '#1e293b', fontSize: '0.925rem', lineHeight: 1.65 }}>
                    {clause.plainEnglishExplainer}
                  </Typography>
                )}
                {currentTone === 'eli5' && (
                  <Typography variant="body2" sx={{ color: '#c2410c', fontSize: '0.925rem', lineHeight: 1.65 }}>
                    <strong style={{ color: '#ea580c' }}>Simple analogy: </strong>
                    {clause.eli5}
                  </Typography>
                )}
                {currentTone === 'impact' && (
                  <Typography variant="body2" sx={{ color: '#0369a1', fontSize: '0.925rem', lineHeight: 1.65 }}>
                    <strong style={{ color: '#0284c7' }}>Real-World Consequence: </strong>
                    {clause.businessImpact}
                  </Typography>
                )}
              </Box>

              {/* Counter-Proposal Box */}
              {clause.suggestedCounterProposal && (
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LightbulbOutlinedIcon sx={{ fontSize: 16, color: '#059669' }} />
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 700, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                      >
                        Recommended Fair Counter-Proposal:
                      </Typography>
                    </Box>

                    <Button
                      size="small"
                      variant="text"
                      onClick={() => handleCopy(`counter-${clause.id}`, clause.suggestedCounterProposal)}
                      startIcon={
                        copiedId === `counter-${clause.id}` ? (
                          <CheckIcon sx={{ fontSize: 14 }} />
                        ) : (
                          <ContentCopyIcon sx={{ fontSize: 14 }} />
                        )
                      }
                      sx={{
                        color: '#059669',
                        fontSize: '0.725rem',
                        py: 0.2,
                        px: 1,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      {copiedId === `counter-${clause.id}` ? 'Copied Wording' : 'Copy Alternative'}
                    </Button>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ color: '#166534', fontStyle: 'italic', fontSize: '0.85rem', lineHeight: 1.5 }}
                  >
                    "{clause.suggestedCounterProposal}"
                  </Typography>
                </Paper>
              )}
            </Card>
          );
        })
      )}
    </Box>
  );
}
