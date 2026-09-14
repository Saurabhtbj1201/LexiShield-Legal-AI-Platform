import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import ShieldAlertIcon from '@mui/icons-material/Security';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import CloseIcon from '@mui/icons-material/Close';
import WhatshotIcon from '@mui/icons-material/Whatshot';

export default function RiskRadar({ analysis }) {
  if (!analysis) return null;

  const {
    overallRiskScore = 50,
    riskLevel = 'Moderate',
    riskSummary = '',
    scoreBreakdown = {},
    missingProtections = [],
    keyObligations = []
  } = analysis;

  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallRiskScore / 100) * circumference;

  const getScoreColor = (score) => {
    if (score >= 75) return '#e11d48'; // Rose
    if (score >= 50) return '#d97706'; // Amber
    if (score >= 25) return '#4f46e5'; // Indigo
    return '#059669'; // Emerald
  };

  const getScoreBg = (score) => {
    if (score >= 75) return '#ffe4e6';
    if (score >= 50) return '#fef3c7';
    if (score >= 25) return '#e0e7ff';
    return '#d1fae5';
  };

  const categoryConfigs = [
    {
      key: 'financial',
      title: 'Financial Exposure',
      icon: <AttachMoneyIcon sx={{ color: '#0284c7', fontSize: 18 }} />,
      data: scoreBreakdown.financial || { score: 30, summary: 'Payment and forfeiture terms' }
    },
    {
      key: 'liability',
      title: 'Liability & Indemnity',
      icon: <ShieldAlertIcon sx={{ color: '#e11d48', fontSize: 18 }} />,
      data: scoreBreakdown.liability || { score: 30, summary: 'Indemnity and damages caps' }
    },
    {
      key: 'rightsAndIp',
      title: 'Rights & Intellectual Property',
      icon: <LockOutlinedIcon sx={{ color: '#7c3aed', fontSize: 18 }} />,
      data: scoreBreakdown.rightsAndIp || { score: 30, summary: 'IP ownership and non-compete reach' }
    },
    {
      key: 'termination',
      title: 'Termination & Remedies',
      icon: <EventBusyIcon sx={{ color: '#d97706', fontSize: 18 }} />,
      data: scoreBreakdown.termination || { score: 30, summary: 'Notice periods and breach remedies' }
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Top Section: Radial Meter + Category Breakdown */}
      <Grid container spacing={3}>
        {/* Gauge Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              backgroundColor: '#ffffff'
            }}
          >
            <Typography
              variant="caption"
              sx={{
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 700,
                color: '#64748b',
                mb: 2
              }}
            >
              Overall Risk Radar
            </Typography>

            <Box sx={{ position: 'relative', width: 180, height: 180, mb: 2 }}>
              <svg style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }} viewBox="0 0 190 190">
                <circle
                  cx="95"
                  cy="95"
                  r={radius}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="14"
                />
                <circle
                  cx="95"
                  cy="95"
                  r={radius}
                  fill="none"
                  stroke={getScoreColor(overallRiskScore)}
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
              </svg>

              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1,
                    color: getScoreColor(overallRiskScore)
                  }}
                >
                  {overallRiskScore}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
                  / 100 RISK INDEX
                </Typography>
              </Box>
            </Box>

            <Chip
              icon={
                overallRiskScore >= 75 ? (
                  <WhatshotIcon sx={{ fontSize: 16, color: '#e11d48 !important' }} />
                ) : (
                  <WarningAmberIcon sx={{ fontSize: 16, color: '#d97706 !important' }} />
                )
              }
              label={`${riskLevel} Risk Profile`}
              sx={{
                backgroundColor: getScoreBg(overallRiskScore),
                border: `1px solid ${getScoreColor(overallRiskScore)}40`,
                color: getScoreColor(overallRiskScore),
                fontWeight: 700,
                fontSize: '0.8rem',
                mb: 1
              }}
            />

            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', px: 2 }}>
              Weighted assessment across indemnity, IP capture, dispute rules, and penalties.
            </Typography>
          </Card>
        </Grid>

        {/* Matrix Dimensions Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: '#64748b' }}
                >
                  Legal Vulnerability Matrix
                </Typography>
                <Chip
                  label="4 Core Dimensions"
                  size="small"
                  sx={{ height: 20, fontSize: '0.7rem', color: '#475569', backgroundColor: '#f1f5f9' }}
                />
              </Box>

              <Typography variant="body2" sx={{ color: '#334155', mb: 3, lineHeight: 1.6 }}>
                {riskSummary}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {categoryConfigs.map(({ key, title, icon, data }) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {icon}
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>
                          {title}
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 700, color: getScoreColor(data.score) }}
                      >
                        {data.score}/100
                      </Typography>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={data.score}
                      sx={{
                        height: 7,
                        borderRadius: 3,
                        backgroundColor: '#e2e8f0',
                        mb: 1,
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          backgroundColor: getScoreColor(data.score)
                        }
                      }}
                    />

                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', lineHeight: 1.4, display: 'block' }}>
                      {data.summary}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Section: Missing Safeguards & Obligations */}
      <Grid container spacing={3}>
        {/* Missing Safeguards */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%', backgroundColor: '#ffffff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
              <WarningAmberIcon sx={{ color: '#d97706', fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>
                Missing Standard Safeguards
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontSize: '0.825rem' }}>
              Standard protective clauses absent from this draft:
            </Typography>

            <List dense disablePadding>
              {missingProtections.map((item, idx) => (
                <ListItem key={idx} disableGutters sx={{ py: 0.75, alignItems: 'flex-start' }}>
                  <ListItemIcon sx={{ minWidth: 26, mt: 0.25 }}>
                    <CloseIcon sx={{ color: '#e11d48', fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{ sx: { fontSize: '0.85rem', color: '#334155' } }}
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Key Duties & Obligations */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%', backgroundColor: '#ffffff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
              <CheckCircleOutlineIcon sx={{ color: '#059669', fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>
                Key Duties & Obligations
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontSize: '0.825rem' }}>
              Primary commitments you are undertaking under this agreement:
            </Typography>

            <List dense disablePadding>
              {keyObligations.map((item, idx) => (
                <ListItem key={idx} disableGutters sx={{ py: 0.75, alignItems: 'flex-start' }}>
                  <ListItemIcon sx={{ minWidth: 26, mt: 0.25 }}>
                    <CheckCircleOutlineIcon sx={{ color: '#059669', fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{ sx: { fontSize: '0.85rem', color: '#334155' } }}
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
