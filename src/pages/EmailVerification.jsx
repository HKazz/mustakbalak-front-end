import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  InputAdornment,
  Alert,
  Snackbar,
  LinearProgress
} from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';
import '../style/SignupPage.css';

function EmailVerification() {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { email, username } = location.state || {};

  const handleChange = (e) => {
    setVerificationCode(e.target.value);
    setError('');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-email`,
        {
          username,
          token: verificationCode
        }
      );

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Email verified successfully! Redirecting to login...',
          severity: 'success'
        });
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      let errorMessage = 'An error occurred during verification';
      
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      }
      
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/resend-verification`,
        { username }
      );
      
      setSnackbar({
        open: true,
        message: 'Verification code resent successfully!',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to resend verification code. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!email || !username) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} className="signup-paper">
          <Typography variant="h5" color="error" align="center">
            Invalid verification page access
          </Typography>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
            >
              Return to Login
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <div className="signup-container">
      <Paper elevation={3} className="signup-paper">
        <Typography variant="h4" className="signup-title">
          Email Verification
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
          Please enter the verification code sent to {email}
        </Typography>

        {loading && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <LinearProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} className="signup-form">
          <TextField
            fullWidth
            label="Verification Code"
            value={verificationCode}
            onChange={handleChange}
            required
            disabled={loading}
            className="form-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            className="submit-button"
            sx={{ mb: 2 }}
          >
            Verify Email
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="primary"
            disabled={loading}
            onClick={handleResendCode}
          >
            Resend Code
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default EmailVerification; 