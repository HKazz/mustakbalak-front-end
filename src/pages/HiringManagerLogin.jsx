import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
  LinearProgress,
  InputAdornment,
  IconButton,
  Divider
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Person as PersonIcon, 
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Business as BusinessIcon
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import '../style/SignupPage.css';

const HiringManagerLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        setLoading(true);
        console.log('Attempting login with:', values);
        console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/hiring-manager/login`,
          values,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Login response:', response.data);

        if (response.data.token) {
          // Store token and user data
          const userData = {
            ...response.data.user,
            userType: "hiring_manager"
          };

          // Call the login function from AuthContext
          await login(response.data.token, userData);

          // Show success message
          setSnackbar({
            open: true,
            message: "Login successful!",
            severity: "success",
          });

          toast.success("Login successful!");

          // Redirect to dashboard
          navigate("/hiring-manager/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Login error:", error);
        const errorMessage = error.response?.data?.message || "Failed to login. Please try again.";
        
        setErrors({ submit: errorMessage });
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "error",
        });

        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
        {formik.errors.submit && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formik.errors.submit}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={formik.handleSubmit} className="signup-form">
          {/* Username Field */}
          <TextField
            fullWidth
            id="username"
            name="username"
            label="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
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
            id="password"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
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

          {/* Job Seeker Login Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Are you a job seeker?
            </Typography>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              startIcon={<PersonIcon />}
              fullWidth
              disabled={loading}
            >
              Sign in as Job Seeker
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
      <ToastContainer />
    </div>
  );
};

export default HiringManagerLogin; 