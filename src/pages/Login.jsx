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
      console.log("Attempting login for username:", formData.username);
      console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);

      // Attempt to login with provided credentials
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Login response:", response.data);
      console.log("Response message:", response.data.message);
      console.log("Response success:", response.data.success);

      if (response.data.message === 'Login successful') {
        // Use the login function from AuthContext
        await login(response.data.token, response.data.user);
        
        // Show success message
        setSnackbar({
          open: true,
          message: "Login successful!",
          severity: "success"
        });

        // Check if user needs to complete profile
        if (response.data.user.userType === 'job_seeker' && 
            (!response.data.user.certificate || !response.data.user.experience)) {
          navigate("/complete-profile", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } else {
        const errorMsg = response.data.error || "Login failed";
        console.error("Login failed:", errorMsg);
        setError(errorMsg);
        setSnackbar({
          open: true,
          message: errorMsg,
          severity: "error"
        });
      }
    } catch (err) {
      console.error("Login error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers
        }
      });

      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Server error response:", err.response.data);
        errorMessage = err.response.data.error || 
                      err.response.data.message || 
                      `Server error (${err.response.status}): ${err.response.statusText}`;
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Request setup error:", err.message);
        errorMessage = `Request error: ${err.message}`;
      }
      
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
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
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Submit Button */}
          <Box className="form-actions">
            <Button
              type="submit"
              variant="contained"
              className="signup-button"
              fullWidth
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </Box>

          {/* Divider */}
          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          {/* Hiring Manager Login Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Are you a hiring manager?
            </Typography>
            <Button
              component={Link}
              to="/hiring-manager/login"
              variant="outlined"
              startIcon={<BusinessIcon />}
              fullWidth
              disabled={loading}
            >
              Sign in as Hiring Manager
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            backgroundColor: snackbar.severity === "success" ? "#2e7d32" : "#d32f2f",
            "& .MuiAlert-icon": {
              color: "white",
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Login;
