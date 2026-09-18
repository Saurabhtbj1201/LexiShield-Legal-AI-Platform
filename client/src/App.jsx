import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Tabs,
  Tab,
  Typography,
  Alert,
  Chip,
  CircularProgress
} from '@mui/material';
import theme from './theme';

import Navbar from './components/Navbar';
import DisclaimerBanner from './components/DisclaimerBanner';
import HeroUpload from './components/HeroUpload';
import RiskRadar from './components/RiskRadar';
import ClauseExplainer from './components/ClauseExplainer';
import ApiKeyModal from './components/ApiKeyModal';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load non-critical workspace tabs for optimal bundle efficiency and instant initial load
const ContractComparison = lazy(() => import('./components/ContractComparison'));
const ChatGrounded = lazy(() => import('./components/ChatGrounded'));
const AttorneyPrepKit = lazy(() => import('./components/AttorneyPrepKit'));
const GenAiArchitectureModal = lazy(() => import('./components/GenAiArchitectureModal'));

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
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);

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

  const handleSaveApiKey = useCallback((key) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('lexishield_gemini_api_key', key);
    } else {
      localStorage.removeItem('lexishield_gemini_api_key');
    }
  }, []);

  const runAnalysis = useCallback(async (text, presetMeta = null) => {
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
  }, [apiKey]);

  const handleSelectPreset = useCallback((preset) => {
    runAnalysis(preset.content, preset);
  }, [runAnalysis]);

  const handleSelectComparisonPreset = useCallback(async (preset) => {
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

      setActiveTab(2); // Jump directly to comparison tab
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const handleUploadFile = useCallback(async (file) => {
    setIsLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', file);
    if (apiKey) formData.append('apiKey', apiKey);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to parse uploaded document');
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
  }, [apiKey]);

  const handleRunComparison = useCallback(async (vA, vB) => {
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
  }, [apiKey, runAnalysis]);

  const handleAskQuestion = useCallback(async (question) => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractText, question, apiKey })
    });
    return await res.json();
  }, [contractText, apiKey]);

  const handleReset = useCallback(() => {
    setContractText('');
    setAnalysis(null);
    setActivePreset(null);
    setComparisonData(null);
    setPrepKitData(null);
    setActiveTab(0);
    setErrorMsg(null);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        {/* WCAG 2.1 AA Skip-to-content Link for Keyboard Users */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <DisclaimerBanner />
          <Navbar
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
            apiKey={apiKey}
            onReset={handleReset}
            activeContractTitle={activePreset?.title}
          />

          <Container component="main" id="main-content" role="main" maxWidth="xl" sx={{ flex: 1, py: { xs: 2.5, md: 4 } }}>
            {errorMsg && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg(null)} role="alert">
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
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#0f172a' }}>
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
                    aria-label="Legal Document Intelligence Workspace Views"
                    sx={{
                      '& .MuiTabs-flexContainer': {
                        gap: { xs: 0.5, md: 1 }
                      }
                    }}
                  >
                    <Tab
                      id="tab-0"
                      aria-controls="tabpanel-0"
                      icon={<SecurityIcon sx={{ fontSize: 18 }} />}
                      iconPosition="start"
                      label="Risk Radar & Matrix"
                    />
                    <Tab
                      id="tab-1"
                      aria-controls="tabpanel-1"
                      icon={<MenuBookIcon sx={{ fontSize: 18 }} />}
                      iconPosition="start"
                      label={`Plain English Explainer (${analysis?.flaggedClauses?.length || 0})`}
                    />
                    <Tab
                      id="tab-2"
                      aria-controls="tabpanel-2"
                      icon={<CompareArrowsIcon sx={{ fontSize: 18 }} />}
                      iconPosition="start"
                      label="Contract Redline & Diff"
                    />
                    <Tab
                      id="tab-3"
                      aria-controls="tabpanel-3"
                      icon={<ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />}
                      iconPosition="start"
                      label="Talk to Contract (Q&A)"
                    />
                    <Tab
                      id="tab-4"
                      aria-controls="tabpanel-4"
                      icon={<BusinessCenterIcon sx={{ fontSize: 18 }} />}
                      iconPosition="start"
                      label="Attorney Prep Kit"
                    />
                  </Tabs>
                </Box>

                {/* Tab Views with accessible role=tabpanel */}
                <Box role="tabpanel" id="tabpanel-0" aria-labelledby="tab-0" hidden={activeTab !== 0}>
                  {activeTab === 0 && <RiskRadar analysis={analysis} />}
                </Box>

                <Box role="tabpanel" id="tabpanel-1" aria-labelledby="tab-1" hidden={activeTab !== 1}>
                  {activeTab === 1 && <ClauseExplainer flaggedClauses={analysis?.flaggedClauses || []} />}
                </Box>

                <Box role="tabpanel" id="tabpanel-2" aria-labelledby="tab-2" hidden={activeTab !== 2}>
                  {activeTab === 2 && (
                    <Suspense fallback={<Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}>
                      <ContractComparison
                        comparisonData={comparisonData}
                        onRunComparison={handleRunComparison}
                        isLoading={isLoading}
                      />
                    </Suspense>
                  )}
                </Box>

                <Box role="tabpanel" id="tabpanel-3" aria-labelledby="tab-3" hidden={activeTab !== 3}>
                  {activeTab === 3 && (
                    <Suspense fallback={<Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}>
                      <ChatGrounded
                        contractText={contractText}
                        onAskQuestion={handleAskQuestion}
                        isLoading={isLoading}
                      />
                    </Suspense>
                  )}
                </Box>

                <Box role="tabpanel" id="tabpanel-4" aria-labelledby="tab-4" hidden={activeTab !== 4}>
                  {activeTab === 4 && (
                    <Suspense fallback={<Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}>
                      <AttorneyPrepKit
                        prepKitData={prepKitData}
                        onGeneratePrepKit={() => {}}
                        isLoading={isLoading}
                      />
                    </Suspense>
                  )}
                </Box>
              </Box>
            )}
          </Container>

          <ApiKeyModal
            isOpen={isApiKeyModalOpen}
            onClose={() => setIsApiKeyModalOpen(false)}
            apiKey={apiKey}
            onSaveApiKey={handleSaveApiKey}
          />

          <Suspense fallback={null}>
            <GenAiArchitectureModal
              open={isArchitectureModalOpen}
              onClose={() => setIsArchitectureModalOpen(false)}
            />
          </Suspense>
        </Box>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
