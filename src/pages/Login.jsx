import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  LinearProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Business as BusinessIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import '../style/SignupPage.css';

/**
 * Login Component
 * 
 * This component handles user authentication and login functionality.
 * It provides a form for users to enter their credentials and manages
 * the login process with proper error handling and navigation.
 */
function Login() {
  // State for form data and UI controls
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Hooks for navigation and authentication
  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles input changes in the form fields
   * @param {Event} e - The change event
   */
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  }

  /**
   * Toggles password visibility
   */
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Prevents default behavior for password visibility toggle
   * @param {Event} event - The mouse down event
   */
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  /**
   * Handles form submission and login process
   * @param {Event} e - The submit event
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await handleLogin();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    try {
      console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          username: formData.username,
          password: formData.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.message === 'Login successful') {
        if (response.data.isFirstLogin) {
          // Redirect to email verification page
          navigate('/verify-email', {
            state: {
              email: response.data.user.email,
              username: formData.username
            }
          });
          return;
        }

        await login(response.data.token, response.data.user);
        
        setSnackbar({
          open: true,
          message: "Login successful!",
          severity: "success"
        });

        if (response.data.user.userType === 'job_seeker' && 
            (!response.data.user.certificate || !response.data.user.experience)) {
          navigate("/complete-profile", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } else {
        const errorMsg = response.data.error || "Login failed";
        setError(errorMsg);
        setSnackbar({
          open: true,
          message: errorMsg,
          severity: "error"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      handleError(error);
    }
  }

  function handleError(err) {
    console.error("Login error details:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });

    let errorMessage = "An unexpected error occurred. Please try again.";
    
    if (err.response) {
      if (err.response.status === 401) {
        errorMessage = "Invalid username or password. Please try again.";
      } else if (err.response.status === 404) {
        errorMessage = "Account not found. Please sign up first.";
      } else {
        errorMessage = err.response.data.error || 
                      err.response.data.message || 
                      `Server error (${err.response.status}): ${err.response.statusText}`;
      }
    } else if (err.request) {
      errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
    } else {
      errorMessage = `Request error: ${err.message}`;
    }
    
    setError(errorMessage);
    setSnackbar({
      open: true,
      message: errorMessage,
      severity: "error"
    });
  }

  return (
    <div className="signup-container">
      <Paper elevation={3} className="signup-paper">
        {/* Header */}
        <Typography variant="h4" className="signup-title">
          Sign In to Mustakbalak
        </Typography>
        
        {/* Loading Indicator */}
        {loading && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <LinearProgress />
          </Box>
        )}

        {/* Error Message Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit} className="signup-form">
          {/* Username Field */}
          <TextField
            fullWidth
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
            className="form-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Password Field */}
          <TextField
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            className="form-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            className="submit-button"
          >
            Sign In
          </Button>

          {/* Sign Up Link */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar for notifications */}
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

export default Login;
