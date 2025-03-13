import React, { useState, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { Mic, Stop, Download } from '@mui/icons-material';
import axios from 'axios';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('audio', audioBlob);

    try {
      const response = await axios.post('http://localhost:5000/api/transcribe', formData);
      setTranscription(response.data.transcription);
      setAnalysis(response.data.analysis);
      
      // Save notes
      await axios.post('http://localhost:5000/api/save-notes', {
        transcription: response.data.transcription,
        analysis: response.data.analysis,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadNotes = () => {
    const content = `Meeting Notes\n\nTranscription:\n${transcription}\n\nAnalysis:\n${analysis}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting_notes_${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          AI Meeting Note Taker
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            color={isRecording ? "error" : "primary"}
            startIcon={isRecording ? <Stop /> : <Mic />}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={loading}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={downloadNotes}
            disabled={!transcription || loading}
          >
            Download Notes
          </Button>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {transcription && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Transcription
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={transcription}
              variant="outlined"
              disabled
            />
          </Box>
        )}

        {analysis && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Analysis
            </Typography>
            <List>
              {analysis.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText primary={line} />
                  </ListItem>
                  {index < analysis.split('\n').length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default App; 