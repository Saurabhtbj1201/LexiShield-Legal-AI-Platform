import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Paper,
  TextField,
  IconButton,
  Chip,
  Stack,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';

export default function ChatGrounded({ _contractText, onAskQuestion, isLoading }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I am your LexiShield legal assistant. Ask any question regarding this agreement—such as termination penalties, IP ownership, liability caps, or payment timelines—and I will provide answers grounded directly in the document text with verifiable citations.',
      citations: [],
      followUps: [
        'What happens if I terminate or exit early?',
        'Who owns the intellectual property and code?',
        'Can they delay or withhold my payments?'
      ]
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputVal;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInputVal('');

    try {
      const response = await onAskQuestion(textToSend);
      if (response && response.answer) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: response.answer,
            citations: response.citations || [],
            confidence: response.confidence || 'High',
            followUps: response.followUpSuggestions || []
          }
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'An error occurred while querying the document text. Please try again.',
          citations: []
        }
      ]);
    }
  };

  return (
    <Card sx={{ height: 600, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <ChatIcon sx={{ color: '#4f46e5', fontSize: 20 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
              Talk to Your Contract
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Context-grounded search with exact clause excerpts
            </Typography>
          </Box>
        </Box>

        <Chip
          icon={<VerifiedUserOutlinedIcon sx={{ fontSize: 14, color: '#059669 !important' }} />}
          label="Citations Active"
          size="small"
          sx={{
            backgroundColor: '#d1fae5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            fontSize: '0.725rem',
            fontWeight: 700
          }}
        />
      </Box>

      {/* Messages Scroll View */}
      <Box
        role="log"
        aria-live="polite"
        aria-atomic="false"
        sx={{ flex: 1, overflowY: 'auto', p: 2.5, display: 'flex', flexDirection: 'column', gap: 2, backgroundColor: '#ffffff' }}
      >
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              maxWidth: '82%',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              p: 2,
              borderRadius: 2.5,
              background:
                msg.role === 'user'
                  ? 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)'
                  : '#f8fafc',
              border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0',
              borderBottomRightRadius: msg.role === 'user' ? 4 : 20,
              borderBottomLeftRadius: msg.role === 'user' ? 20 : 4,
              boxShadow: msg.role === 'user' ? '0 4px 12px rgba(79, 70, 229, 0.2)' : 'none'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: msg.role === 'user' ? '#ffffff' : '#1e293b',
                lineHeight: 1.6,
                fontSize: '0.9rem',
                whiteSpace: 'pre-wrap'
              }}
            >
              {msg.content}
            </Typography>

            {/* Citations */}
            {msg.citations && msg.citations.length > 0 && (
              <Stack spacing={1} sx={{ mt: 1.5 }}>
                {msg.citations.map((cite, cIdx) => (
                  <Paper
                    key={cIdx}
                    sx={{
                      p: 1.5,
                      backgroundColor: '#ffffff',
                      border: '1px solid #c7d2fe',
                      borderRadius: 1.5
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <FormatQuoteIcon sx={{ fontSize: 15, color: '#4f46e5' }} />
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#4338ca' }}>
                        {cite.clauseTitle || 'Document Citation'}
                      </Typography>
                      {cite.pageOrSection && (
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          ({cite.pageOrSection})
                        </Typography>
                      )}
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: '"JetBrains Mono", monospace',
                        color: '#334155',
                        fontStyle: 'italic',
                        display: 'block'
                      }}
                    >
                      "{cite.excerpt}"
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            )}

            {/* Follow-up Prompts */}
            {msg.followUps && msg.followUps.length > 0 && (
              <Box sx={{ mt: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
                  <HelpOutlineIcon sx={{ fontSize: 13, color: '#64748b' }} />
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Suggested follow-up questions:
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {msg.followUps.map((prompt, pIdx) => (
                    <Chip
                      key={pIdx}
                      label={prompt}
                      size="small"
                      clickable
                      onClick={() => handleSend(prompt)}
                      icon={<SubdirectoryArrowRightIcon sx={{ fontSize: 13 }} />}
                      sx={{
                        backgroundColor: '#ffffff',
                        borderColor: '#cbd5e1',
                        color: '#334155',
                        fontSize: '0.75rem',
                        '&:hover': {
                          backgroundColor: '#eef2ff',
                          color: '#4338ca',
                          borderColor: '#a5b4fc'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        ))}

        {isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, alignSelf: 'flex-start' }}>
            <CircularProgress size={16} color="inherit" />
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Formulating grounded response...
            </Typography>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input Row */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        sx={{
          p: 1.5,
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: 1
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Ask a question about this contract (e.g. 'Can they fire me without cause?')..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          disabled={isLoading}
          inputProps={{ 'aria-label': 'Ask a question about this contract' }}
          sx={{ backgroundColor: '#ffffff' }}
        />
        <IconButton
          type="submit"
          color="primary"
          aria-label="Send query to contract assistant"
          disabled={!inputVal.trim() || isLoading}
          sx={{
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#4338ca'
            },
            '&.Mui-disabled': {
              backgroundColor: '#e2e8f0',
              color: '#94a3b8'
            }
          }}
        >
          <SendIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Card>
  );
}
