import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import confetti from 'canvas-confetti';

export default function AttorneyPrepKit({ prepKitData, onGeneratePrepKit, isLoading }) {
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    if (!prepKitData) return;

    let md = `# Attorney Consultation Brief: ${prepKitData.executiveSummary}\n\n`;
    md += `## Client Goals\n${prepKitData.userGoals}\n\n`;
    md += `## Top Red Flags\n` + prepKitData.topRedFlags?.map((f) => `- ${f}`).join('\n') + '\n\n';
    md += `## Missing Safeguards\n` + prepKitData.missingSafeguards?.map((s) => `- ${s}`).join('\n') + '\n\n';
    md += `## 5 Targeted Questions for Attorney Consultation\n`;
    prepKitData.attorneyConsultationQuestions?.forEach((q) => {
      md += `### ${q.questionNumber}. ${q.question}\n`;
      md += `- **Why it matters**: ${q.whyItMatters}\n`;
      md += `- **What to ask for**: ${q.whatToAskFor}\n\n`;
    });
    md += `## Estimated Negotiation Leverage\n${prepKitData.estimatedNegotiationLeverage}\n`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header Card */}
      <Card
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #eef2ff 0%, #f0fdfa 100%)',
          border: '1px solid #c7d2fe',
          boxShadow: '0 4px 16px -2px rgba(79, 70, 229, 0.08)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 2.5
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.5 }}>
              <BusinessCenterIcon sx={{ color: '#4f46e5', fontSize: 24 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Attorney Consultation Prep Kit
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#475569', maxWidth: 680 }}>
              Maximized for high-efficiency legal meetings. Arrive prepared with prioritized red flags,
              target counter-proposals, and exact questions to minimize billable attorney hours.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={handlePrint}
              startIcon={<PrintIcon />}
              sx={{ borderColor: '#cbd5e1', backgroundColor: '#ffffff' }}
            >
              Print / PDF
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleCopyMarkdown}
              startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
            >
              {copied ? 'Copied Markdown!' : 'Copy Brief'}
            </Button>
          </Stack>
        </Box>

        {prepKitData?.executiveSummary && (
          <Paper
            sx={{
              p: 2,
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 2
            }}
          >
            <Typography variant="body2" sx={{ color: '#1e293b', lineHeight: 1.6 }}>
              <strong style={{ color: '#4f46e5' }}>Executive Summary: </strong>
              {prepKitData.executiveSummary}
            </Typography>
          </Paper>
        )}
      </Card>

      {/* 5 Targeted Strategic Questions */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <HelpOutlineIcon sx={{ color: '#4f46e5', fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
            5 Strategic Questions to Ask Your Legal Counsel
          </Typography>
        </Box>

        <Stack spacing={2}>
          {prepKitData?.attorneyConsultationQuestions?.map((q) => (
            <Card key={q.questionNumber} sx={{ p: 2.5, backgroundColor: '#ffffff' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: '#4f46e5',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    flexShrink: 0
                  }}
                >
                  {q.questionNumber}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>
                  {q.question}
                </Typography>
              </Box>

              <Box sx={{ pl: 5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                  <strong style={{ color: '#1e293b' }}>Why this matters: </strong>
                  {q.whyItMatters}
                </Typography>

                <Paper
                  sx={{
                    p: 1.5,
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: 1.5
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#15803d', fontSize: '0.85rem' }}>
                    <strong style={{ color: '#166534' }}>What to ask your lawyer to draft/counter: </strong>
                    {q.whatToAskFor}
                  </Typography>
                </Paper>
              </Box>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Red Flags & Leverage Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%', backgroundColor: '#ffffff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <WarningAmberIcon sx={{ color: '#e11d48', fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>
                Priority Red Flags for Review
              </Typography>
            </Box>

            <List dense disablePadding>
              {prepKitData?.topRedFlags?.map((flag, idx) => (
                <ListItem key={idx} disableGutters sx={{ py: 0.75, alignItems: 'flex-start' }}>
                  <ListItemIcon sx={{ minWidth: 24, mt: 0.25 }}>
                    <Typography sx={{ color: '#e11d48', fontWeight: 700 }}>!</Typography>
                  </ListItemIcon>
                  <ListItemText
                    primary={flag}
                    primaryTypographyProps={{ sx: { fontSize: '0.85rem', color: '#334155' } }}
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%', backgroundColor: '#ffffff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <VerifiedUserIcon sx={{ color: '#059669', fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>
                Negotiation Leverage Assessment
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.6, mb: 2 }}>
              {prepKitData?.estimatedNegotiationLeverage ||
                'Moderate - Industry standards provide strong grounds to negotiate these boilerplate terms.'}
            </Typography>

            <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
              💡 Presenting these organized items signals you have done your due diligence, saving billable time during your first meeting.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
