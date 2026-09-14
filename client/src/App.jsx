import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Tabs,
  Tab,
  Typography,
  Alert,
  Chip
} from '@mui/material';
import theme from './theme';

import Navbar from './components/Navbar';
import DisclaimerBanner from './components/DisclaimerBanner';
import HeroUpload from './components/HeroUpload';
import RiskRadar from './components/RiskRadar';
import ClauseExplainer from './components/ClauseExplainer';
import ContractComparison from './components/ContractComparison';
import ChatGrounded from './components/ChatGrounded';
import AttorneyPrepKit from './components/AttorneyPrepKit';
import ApiKeyModal from './components/ApiKeyModal';

import SecurityIcon from '@mui/icons-material/Security';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import confetti from 'canvas-confetti';

export default function App() {
  const [presets, setPresets] = useState([]);
  const [activePreset, setActivePreset] = useState(null);
  const [contractText, setContractText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [prepKitData, setPrepKitData] = useState(null);

  const [activeTab, setActiveTab] = useState(0); // 0: radar, 1: explainer, 2: compare, 3: chat, 4: prepkit
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Gemini API Key state
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('lexishield_gemini_api_key') || '');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/presets')
      .then((res) => res.json())
      .then((data) => {
        if (data.presets) {
          setPresets(data.presets);
        }
      })
      .catch((err) => console.warn('Could not fetch presets:', err));
  }, []);

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('lexishield_gemini_api_key', key);
    } else {
      localStorage.removeItem('lexishield_gemini_api_key');
    }
  };

  const runAnalysis = async (text, presetMeta = null) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, apiKey })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Contract analysis failed');
      }

      setContractText(text);
      setAnalysis(data.analysis);
      setActivePreset(presetMeta);
      setActiveTab(0);

      fetch('/api/prep-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractAnalysis: data.analysis, userGoals: '', apiKey })
      })
        .then((r) => r.json())
        .then((pkData) => {
          if (pkData.success) setPrepKitData(pkData.prepKit);
        })
        .catch((e) => console.warn('Prep kit auto-generation failed:', e));

      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset) => {
    runAnalysis(preset.content, preset);
  };

  const handleSelectComparisonPreset = async (preset) => {
    setIsLoading(true);
    setErrorMsg(null);
    setActivePreset(preset);
    setContractText(preset.versionB.content);

    try {
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: preset.versionB.content, apiKey })
      });
      const analyzeData = await analyzeRes.json();
      if (analyzeData.success) {
        setAnalysis(analyzeData.analysis);
      }

      const compareRes = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          versionA: preset.versionA.content,
          versionB: preset.versionB.content,
          apiKey
        })
      });
      const compareData = await compareRes.json();
      if (compareData.success) {
        setComparisonData(compareData.comparison);
      }

      setActiveTab(2);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadFile = async (file) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (apiKey) formData.append('apiKey', apiKey);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to parse and analyze file');
      }

      setContractText(data.extractedText);
      setAnalysis(data.analysis);
      setActivePreset({
        title: data.fileName,
        category: 'Uploaded Document'
      });
      setActiveTab(0);

      fetch('/api/prep-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractAnalysis: data.analysis, userGoals: '', apiKey })
      })
        .then((r) => r.json())
        .then((pkData) => {
          if (pkData.success) setPrepKitData(pkData.prepKit);
        });

      confetti({ particleCount: 35, spread: 55, origin: { y: 0.6 } });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunComparison = async (vA, vB) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionA: vA, versionB: vB, apiKey })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Comparison failed');
      }
      setComparisonData(data.comparison);
      runAnalysis(vB, { title: 'Custom Compared Contract (v2)', category: 'Comparison' });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = async (question) => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractText, question, apiKey })
    });
    return await res.json();
  };

  const handleReset = () => {
    setContractText('');
    setAnalysis(null);
    setActivePreset(null);
    setComparisonData(null);
    setPrepKitData(null);
    setActiveTab(0);
    setErrorMsg(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <DisclaimerBanner />
        <Navbar
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          apiKey={apiKey}
          onReset={handleReset}
          activeContractTitle={activePreset?.title}
        />

        <Container maxWidth="xl" sx={{ flex: 1, py: { xs: 2.5, md: 4 } }}>
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg(null)}>
              {errorMsg}
            </Alert>
          )}

          {!analysis && !comparisonData ? (
            <HeroUpload
              presets={presets}
              onSelectPreset={handleSelectPreset}
              onSelectComparisonPreset={handleSelectComparisonPreset}
              onAnalyzeText={(txt) =>
                runAnalysis(txt, { title: 'Custom Pasted Agreement', category: 'Custom Draft' })
              }
              onUploadFile={handleUploadFile}
              isLoading={isLoading}
            />
          ) : (
            <Box>
              {/* Document Overview Header */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1.5,
                  mb: 3
                }}
              >
                <Box>
                  <Chip
                    label={activePreset?.category || analysis?.documentType || 'Contract Analysis'}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      backgroundColor: '#f0fdfa',
                      color: '#0f766e',
                      border: '1px solid #ccfbf1',
                      mb: 0.75
                    }}
                  />
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    {activePreset?.title || analysis?.documentType || 'Document Intelligence Workspace'}
                  </Typography>
                </Box>

                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {contractText.length} characters analyzed
                </Typography>
              </Box>

              {/* Workspace Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: '#e2e8f0', mb: 3 }}>
                <Tabs
                  value={activeTab}
                  onChange={(e, val) => setActiveTab(val)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    '& .MuiTabs-flexContainer': {
                      gap: { xs: 0.5, md: 1 }
                    }
                  }}
                >
                  <Tab
                    icon={<SecurityIcon sx={{ fontSize: 18 }} />}
                    iconPosition="start"
                    label="Risk Radar & Matrix"
                  />
                  <Tab
                    icon={<MenuBookIcon sx={{ fontSize: 18 }} />}
                    iconPosition="start"
                    label={`Plain English Explainer (${analysis?.flaggedClauses?.length || 0})`}
                  />
                  <Tab
                    icon={<CompareArrowsIcon sx={{ fontSize: 18 }} />}
                    iconPosition="start"
                    label="Contract Redline & Diff"
                  />
                  <Tab
                    icon={<ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />}
                    iconPosition="start"
                    label="Talk to Contract (Q&A)"
                  />
                  <Tab
                    icon={<BusinessCenterIcon sx={{ fontSize: 18 }} />}
                    iconPosition="start"
                    label="Attorney Prep Kit"
                  />
                </Tabs>
              </Box>

              {/* Tab Views */}
              {activeTab === 0 && <RiskRadar analysis={analysis} />}
              {activeTab === 1 && <ClauseExplainer flaggedClauses={analysis?.flaggedClauses || []} />}
              {activeTab === 2 && (
                <ContractComparison
                  comparisonData={comparisonData}
                  onRunComparison={handleRunComparison}
                  isLoading={isLoading}
                />
              )}
              {activeTab === 3 && (
                <ChatGrounded
                  contractText={contractText}
                  onAskQuestion={handleAskQuestion}
                  isLoading={isLoading}
                />
              )}
              {activeTab === 4 && (
                <AttorneyPrepKit
                  prepKitData={prepKitData}
                  onGeneratePrepKit={() => {}}
                  isLoading={isLoading}
                />
              )}
            </Box>
          )}
        </Container>

        <ApiKeyModal
          isOpen={isApiKeyModalOpen}
          onClose={() => setIsApiKeyModalOpen(false)}
          apiKey={apiKey}
          onSaveApiKey={handleSaveApiKey}
        />
      </Box>
    </ThemeProvider>
  );
}
