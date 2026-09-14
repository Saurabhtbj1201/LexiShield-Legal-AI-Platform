import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  Tabs,
  Tab,
  TextField,
  Button,
  Chip,
  CircularProgress
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArticleIcon from '@mui/icons-material/Article';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function HeroUpload({
  presets,
  onSelectPreset,
  onAnalyzeText,
  onUploadFile,
  isLoading,
  onSelectComparisonPreset
}) {
  const [tabIndex, setTabIndex] = useState(0); // 0: presets, 1: upload, 2: paste
  const [pastedText, setPastedText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handlePasteSubmit = (e) => {
    e.preventDefault();
    if (!pastedText.trim()) return;
    onAnalyzeText(pastedText);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onUploadFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) onUploadFile(file);
  };

  const getPresetIcon = (id) => {
    switch (id) {
      case 'residential-lease':
        return <HomeWorkIcon sx={{ color: '#0891b2', fontSize: 22 }} />;
      case 'freelance-predatory':
        return <WorkOutlineIcon sx={{ color: '#d97706', fontSize: 22 }} />;
      case 'mutual-nda':
        return <ShieldOutlinedIcon sx={{ color: '#7c3aed', fontSize: 22 }} />;
      case 'employment-comparison-v1-v2':
        return <CompareArrowsIcon sx={{ color: '#059669', fontSize: 22 }} />;
      default:
        return <ArticleIcon sx={{ color: '#4f46e5', fontSize: 22 }} />;
    }
  };

  return (
    <Box sx={{ textAlign: 'center', py: { xs: 3, md: 5 } }}>
      {/* Hero Badge */}
      <Chip
        icon={<AutoAwesomeIcon sx={{ fontSize: 16, color: '#4f46e5 !important' }} />}
        label="GenAI Legal Access & Contract Intelligence"
        sx={{
          backgroundColor: '#eef2ff',
          border: '1px solid #c7d2fe',
          color: '#4338ca',
          fontWeight: 700,
          fontSize: '0.8rem',
          mb: 2.5,
          py: 0.5
        }}
      />

      {/* Main Heading */}
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '2.3rem', md: '3.3rem' },
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          mb: 2,
          color: '#0f172a'
        }}
      >
        Demystify Legalese.{' '}
        <span
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #0891b2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Detect Hidden Traps.
        </span>
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: '#475569',
          fontSize: { xs: '0.95rem', md: '1.125rem' },
          maxWidth: 720,
          mx: 'auto',
          mb: 4,
          lineHeight: 1.6
        }}
      >
        Understand complex legal documents in plain English, assess unfair clauses with an interactive
        Risk Radar, compare contract versions, and generate attorney-ready consultation briefs.
      </Typography>

      {/* Mode Selector Tabs */}
      <Box sx={{ maxWidth: 880, mx: 'auto' }}>
        <Box sx={{ borderBottom: 1, borderColor: '#e2e8f0', mb: 3 }}>
          <Tabs
            value={tabIndex}
            onChange={(e, val) => setTabIndex(val)}
            centered
            sx={{
              '& .MuiTabs-flexContainer': {
                gap: 1
              }
            }}
          >
            <Tab
              icon={<FlashOnIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Instant Demo Presets"
            />
            <Tab
              icon={<CloudUploadIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Upload Document (PDF/TXT)"
            />
            <Tab
              icon={<ArticleIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Paste Contract Text"
            />
          </Tabs>
        </Box>

        {/* Tab 0: Demo Presets Grid */}
        {tabIndex === 0 && (
          <Box>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 700,
                color: '#64748b',
                mb: 2.5
              }}
            >
              Select a real-world scenario to evaluate instantly:
            </Typography>

            <Grid container spacing={2.5}>
              {presets.map((preset) => (
                <Grid item xs={12} sm={6} key={preset.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      textAlign: 'left',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      '&:hover': {
                        borderColor: '#818cf8',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 28px -4px rgba(79, 70, 229, 0.15)'
                      }
                    }}
                  >
                    <CardActionArea
                      onClick={() => {
                        if (preset.versionA && preset.versionB) {
                          onSelectComparisonPreset(preset);
                        } else {
                          onSelectPreset(preset);
                        }
                      }}
                      sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1.5 }}>
                        <Chip
                          label={preset.category}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            backgroundColor: '#f0fdfa',
                            color: '#0f766e',
                            border: '1px solid #ccfbf1'
                          }}
                        />
                        {getPresetIcon(preset.id)}
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', mb: 1, color: '#0f172a' }}>
                        {preset.title}
                      </Typography>

                      <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.5, mb: 2, flex: 1 }}>
                        {preset.tagline}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#4f46e5', fontWeight: 600, fontSize: '0.825rem' }}>
                        <span>{preset.versionA ? 'Compare Redlines' : 'Analyze & Score'}</span>
                        <ArrowForwardIcon sx={{ fontSize: 15 }} />
                      </Box>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Tab 1: Upload Document */}
        {tabIndex === 1 && (
          <Card sx={{ p: 4, textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <Box
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: '2px dashed',
                borderColor: isDragOver ? '#4f46e5' : '#cbd5e1',
                backgroundColor: isDragOver ? '#eef2ff' : '#f8fafc',
                borderRadius: 3,
                py: 6,
                px: 3,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                  borderColor: '#94a3b8'
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md,.doc,.docx"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: '#eef2ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4f46e5',
                  mx: 'auto',
                  mb: 2
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 32 }} />
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>
                Drop your legal document here or click to browse
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 460, mx: 'auto' }}>
                Supports standard PDF agreements, residential leases, NDAs, employment offers, and text files (up to 10MB).
              </Typography>
            </Box>

            {isLoading && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mt: 3, color: '#4f46e5' }}>
                <CircularProgress size={20} color="inherit" />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Extracting document text and computing risk radar...
                </Typography>
              </Box>
            )}
          </Card>
        )}

        {/* Tab 2: Paste Contract Text */}
        {tabIndex === 2 && (
          <Card sx={{ p: 3, textAlign: 'left', border: '1px solid #e2e8f0' }}>
            <form onSubmit={handlePasteSubmit}>
              <TextField
                fullWidth
                multiline
                rows={8}
                placeholder="Paste the contract text or suspicious clauses here (e.g. non-compete, indemnification, house rules)..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                sx={{
                  '& .MuiInputBase-root': {
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                    backgroundColor: '#f8fafc'
                  }
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {pastedText.length} characters
                </Typography>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!pastedText.trim() || isLoading}
                  startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
                >
                  {isLoading ? 'Analyzing...' : 'Analyze Document'}
                </Button>
              </Box>
            </form>
          </Card>
        )}
      </Box>
    </Box>
  );
}
