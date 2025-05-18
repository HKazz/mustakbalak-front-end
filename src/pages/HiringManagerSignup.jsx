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
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
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
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Visibility,
  VisibilityOff,
  LocationOn,
  CheckCircle,
  Error,
  Security,
  ContactMail,
  Home,
  Badge,
  BusinessCenter
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import '../style/SignupPage.css';

// Password strength checker
const getPasswordStrength = (password) => {
  if (!password) return 0;
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  return strength;
};

// Add role and company size options
const roles = ["recruiter", "hiring manager", "talent acquisition", "hr manager"];
const companySizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

const HiringManagerSignup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      fullName: "",
      email: "",
      countryCode: "+966",
      phoneNumber: "",
      company: "",
      currentPosition: "",
      department: "",
      role: "",
      companySize: "",
      industry: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        postalCode: ""
      },
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters"),
      fullName: Yup.string()
        .required("Full name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      countryCode: Yup.string()
        .required("Country code is required"),
      phoneNumber: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]+$/, "Phone number must contain only digits")
        .min(8, "Phone number must be at least 8 digits")
        .max(11, "Phone number cannot exceed 11 digits"),
      company: Yup.string()
        .required("Company name is required"),
      currentPosition: Yup.string()
        .required("Current position is required"),
      department: Yup.string()
        .required("Department is required"),
      role: Yup.string()
        .required("Role is required"),
      companySize: Yup.string()
        .required("Company size is required"),
      industry: Yup.string()
        .required("Industry is required"),
      address: Yup.object({
        street: Yup.string().required("Street is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        country: Yup.string().required("Country is required"),
        postalCode: Yup.string().required("Postal code is required"),
      }),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number"),
      confirmPassword: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        setLoading(true);
        console.log('Attempting signup with:', values);
        console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);

        // Format the data according to the backend model
        const signupData = {
          username: values.username,
          fullName: values.fullName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          password: values.password,
          currentPosition: values.currentPosition,
          company: values.company,
          department: values.department,
          role: values.role,
          companySize: values.companySize,
          industry: values.industry,
          address: {
            street: values.address.street,
            city: values.address.city,
            state: values.address.state,
            country: values.address.country,
            postalCode: values.address.postalCode
          }
        };

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/hiring-manager/signup`,
          signupData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Signup response:', response.data);

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
            message: "Account created successfully! Redirecting to dashboard...",
            severity: "success",
          });

          toast.success("Account created successfully!");

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate("/hiring-manager/dashboard", { replace: true });
          }, 2000);
        }
      } catch (error) {
        console.error("Signup error:", error);
        let errorMessage = "Failed to create account. ";
        
        if (error.response) {
          errorMessage += error.response.data?.message || "Please check your information and try again.";
        } else if (error.request) {
          errorMessage += "No response from server. Please check your connection.";
        } else {
          errorMessage += error.message || "Please try again.";
        }
        
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

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handlePasswordChange = (e) => {
    formik.handleChange(e);
    setPasswordStrength(getPasswordStrength(e.target.value));
  };

  const validateStep = (stepIndex, values) => {
    switch (stepIndex) {
      case 0: // Personal Information
        return values.username && values.fullName && 
               !formik.errors.username && !formik.errors.fullName;
      case 1: // Company Information
        return values.company && values.currentPosition && values.department && 
               values.role && values.companySize && values.industry &&
               !formik.errors.company && !formik.errors.currentPosition && 
               !formik.errors.department && !formik.errors.role && 
               !formik.errors.companySize && !formik.errors.industry;
      case 2: // Contact Information
        return values.email && values.phoneNumber && values.countryCode &&
               !formik.errors.email && !formik.errors.phoneNumber && 
               !formik.errors.countryCode;
      case 3: // Address Information
        return values.address.street && values.address.city && 
               values.address.state && values.address.country && 
               values.address.postalCode &&
               !formik.errors.address?.street && !formik.errors.address?.city &&
               !formik.errors.address?.state && !formik.errors.address?.country &&
               !formik.errors.address?.postalCode;
      case 4: // Security
        return values.password && values.confirmPassword &&
               !formik.errors.password && !formik.errors.confirmPassword;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep, formik.values)) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      // Mark all fields in the current step as touched to show validation errors
      const currentStepFields = getStepFields(activeStep);
      currentStepFields.forEach(field => {
        formik.setFieldTouched(field, true);
      });
    }
  };

  const getStepFields = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return ['username', 'fullName'];
      case 1:
        return ['company', 'currentPosition', 'department', 'role', 'companySize', 'industry'];
      case 2:
        return ['email', 'phoneNumber', 'countryCode'];
      case 3:
        return ['address.street', 'address.city', 'address.state', 'address.country', 'address.postalCode'];
      case 4:
        return ['password', 'confirmPassword'];
      default:
        return [];
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  const steps = [
    {
      label: 'Personal Information',
      icon: <PersonIcon />,
      content: (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="username"
              label="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              className="form-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="fullName"
              label="Full Name"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
              className="form-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Company Information',
      icon: <BusinessIcon />,
      content: (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="company"
              label="Company Name"
              value={formik.values.company}
              onChange={formik.handleChange}
              error={formik.touched.company && Boolean(formik.errors.company)}
              helperText={formik.touched.company && formik.errors.company}
              className="form-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="currentPosition"
              label="Current Position"
              value={formik.values.currentPosition}
              onChange={formik.handleChange}
              error={formik.touched.currentPosition && Boolean(formik.errors.currentPosition)}
              helperText={formik.touched.currentPosition && formik.errors.currentPosition}
              className="form-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="department"
              label="Department"
              value={formik.values.department}
              onChange={formik.handleChange}
              error={formik.touched.department && Boolean(formik.errors.department)}
              helperText={formik.touched.department && formik.errors.department}
              className="form-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessCenter />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={formik.touched.role && Boolean(formik.errors.role)}>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                label="Role"
                className="form-field"
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.role && formik.errors.role && (
                <FormHelperText error>{formik.errors.role}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={formik.touched.companySize && Boolean(formik.errors.companySize)}>
              <InputLabel>Company Size</InputLabel>
              <Select
                name="companySize"
                value={formik.values.companySize}
                onChange={formik.handleChange}
                label="Company Size"
                className="form-field"
              >
                {companySizes.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.companySize && formik.errors.companySize && (
                <FormHelperText error>{formik.errors.companySize}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="industry"
              label="Industry"
              value={formik.values.industry}
              onChange={formik.handleChange}
              error={formik.touched.industry && Boolean(formik.errors.industry)}
              helperText={formik.touched.industry && formik.errors.industry}
              className="form-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Contact Information',
      icon: <ContactMail />,
      content: (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              className="form-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box className="phone-field-container">
              <FormControl className="country-code-select" error={formik.touched.countryCode && Boolean(formik.errors.countryCode)}>
                <InputLabel>Country Code</InputLabel>
                <Select
                  name="countryCode"
                  value={formik.values.countryCode}
                  onChange={formik.handleChange}
                  label="Country Code"
                  className="form-field"
                >
                  <MenuItem value="+966">🇸🇦 +966</MenuItem>
                  <MenuItem value="+971">🇦🇪 +971</MenuItem>
                  <MenuItem value="+973">🇧🇭 +973</MenuItem>
                  <MenuItem value="+974">🇶🇦 +974</MenuItem>
                  <MenuItem value="+965">🇰🇼 +965</MenuItem>
                  <MenuItem value="+968">🇴🇲 +968</MenuItem>
                </Select>
                {formik.touched.countryCode && formik.errors.countryCode && (
                  <FormHelperText error>{formik.errors.countryCode}</FormHelperText>
                )}
              </FormControl>
              <TextField
                fullWidth
                name="phoneNumber"
                label="Phone Number"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                className="form-field phone-input"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Address Information',
      icon: <Home />,
      content: (
        <div className="address-section">
          <Typography variant="h6" className="address-section-title">
            <LocationOn /> Company Address
          </Typography>
          <Grid container spacing={2} className="address-grid">
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="address.street"
                label="Street"
                value={formik.values.address.street}
                onChange={formik.handleChange}
                error={formik.touched.address?.street && Boolean(formik.errors.address?.street)}
                helperText={formik.touched.address?.street && formik.errors.address?.street}
                className="form-field"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="address.city"
                label="City"
                value={formik.values.address.city}
                onChange={formik.handleChange}
                error={formik.touched.address?.city && Boolean(formik.errors.address?.city)}
                helperText={formik.touched.address?.city && formik.errors.address?.city}
                className="form-field"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="address.state"
                label="State"
                value={formik.values.address.state}
                onChange={formik.handleChange}
                error={formik.touched.address?.state && Boolean(formik.errors.address?.state)}
                helperText={formik.touched.address?.state && formik.errors.address?.state}
                className="form-field"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="address.country"
                label="Country"
                value={formik.values.address.country}
                onChange={formik.handleChange}
                error={formik.touched.address?.country && Boolean(formik.errors.address?.country)}
                helperText={formik.touched.address?.country && formik.errors.address?.country}
                className="form-field"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="address.postalCode"
                label="Postal Code"
                value={formik.values.address.postalCode}
                onChange={formik.handleChange}
                error={formik.touched.address?.postalCode && Boolean(formik.errors.address?.postalCode)}
                helperText={formik.touched.address?.postalCode && formik.errors.address?.postalCode}
                className="form-field"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </div>
      )
    },
    {
      label: 'Security',
      icon: <Security />,
      content: (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box className="password-field-container">
              <TextField
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formik.values.password}
                onChange={handlePasswordChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
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
              <Box className="password-strength">
                <LinearProgress 
                  variant="determinate" 
                  value={passwordStrength} 
                  className={`strength-${Math.floor(passwordStrength / 25)}`}
                />
                <Typography variant="caption" className="strength-text">
                  {passwordStrength === 0 && 'Enter a password'}
                  {passwordStrength === 25 && 'Weak'}
                  {passwordStrength === 50 && 'Fair'}
                  {passwordStrength === 75 && 'Good'}
                  {passwordStrength === 100 && 'Strong'}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      )
    }
  ];

  return (
    <div className="signup-container">
      <Paper elevation={3} className="signup-paper">
        <Typography variant="h4" className="signup-title">
          Create Hiring Manager Account
        </Typography>

        {loading && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <LinearProgress />
          </Box>
        )}

        {formik.errors.submit && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formik.errors.submit}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit} className="signup-form">
          <Stepper activeStep={activeStep} orientation="vertical" className="signup-stepper">
            {steps.map((step, index) => {
              const isStepValid = validateStep(index, formik.values);
              const isStepError = formik.touched[Object.keys(formik.values)[index]] && 
                                Boolean(formik.errors[Object.keys(formik.values)[index]]);

              return (
                <Step key={step.label} completed={Boolean(isStepValid)}>
                  <StepLabel
                    error={isStepError}
                    StepIconComponent={() => (
                      <Box className={`step-icon ${isStepValid ? 'step-completed' : isStepError ? 'step-error' : ''}`}>
                        {isStepValid ? <CheckCircle /> : isStepError ? <Error /> : step.icon}
                      </Box>
                    )}
                    onClick={() => handleStepClick(index)}
                  >
                    {step.label}
                    {isStepError && (
                      <Typography variant="caption" color="error" className="step-error-message">
                        Please complete all required fields
                      </Typography>
                    )}
                  </StepLabel>
                  <StepContent>
                    {step.content}
                    <Box className="step-actions">
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        variant="outlined"
                        className="back-button"
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        onClick={activeStep === steps.length - 1 ? formik.handleSubmit : handleNext}
                        className="next-button"
                        disabled={!isStepValid}
                      >
                        {activeStep === steps.length - 1 ? 'Create Account' : 'Next'}
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              );
            })}
          </Stepper>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Are you a job seeker?
            </Typography>
            <Button
              component={Link}
              to="/signup"
              variant="outlined"
              startIcon={<PersonIcon />}
              fullWidth
              disabled={loading}
            >
              Sign up as Job Seeker
            </Button>
          </Box>
        </Box>
      </Paper>

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

export default HiringManagerSignup; 