import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Box, 
  Container, 
  Card, 
  CardContent, 
  CardActionArea, 
  InputAdornment,
  Select,
  MenuItem,
  LinearProgress,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  Snackbar,
  ListSubheader,
  TextField as MuiTextField,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  FormHelperText
} from '@mui/material';
import { 
  Person, 
  Work, 
  Email, 
  Phone, 
  LocationOn, 
  Business, 
  Lock,
  Search,
  BusinessCenter,
  CheckCircle,
  Error,
  Visibility,
  VisibilityOff,
  AccountCircle,
  ContactMail,
  Home,
  Security
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

// Country codes with regions
const countryCodes = [
  {
    region: 'Middle East',
    countries: [
      { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
      { code: '+971', country: 'UAE', flag: '🇦🇪' },
      { code: '+973', country: 'Bahrain', flag: '🇧🇭' },
      { code: '+974', country: 'Qatar', flag: '🇶🇦' },
      { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
      { code: '+968', country: 'Oman', flag: '🇴🇲' },
      { code: '+962', country: 'Jordan', flag: '🇯🇴' },
      { code: '+961', country: 'Lebanon', flag: '🇱🇧' },
      { code: '+20', country: 'Egypt', flag: '🇪🇬' },
      { code: '+212', country: 'Morocco', flag: '🇲🇦' },
      { code: '+216', country: 'Tunisia', flag: '🇹🇳' },
      { code: '+213', country: 'Algeria', flag: '🇩🇿' },
      { code: '+964', country: 'Iraq', flag: '🇮🇶' },
      { code: '+963', country: 'Syria', flag: '🇸🇾' },
      { code: '+967', country: 'Yemen', flag: '🇾🇪' },
    ]
  },
  {
    region: 'North America',
    countries: [
      { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
      { code: '+52', country: 'Mexico', flag: '🇲🇽' },
    ]
  },
  {
    region: 'Europe',
    countries: [
      { code: '+44', country: 'UK', flag: '🇬🇧' },
      { code: '+33', country: 'France', flag: '🇫🇷' },
      { code: '+49', country: 'Germany', flag: '🇩🇪' },
      { code: '+39', country: 'Italy', flag: '🇮🇹' },
      { code: '+34', country: 'Spain', flag: '🇪🇸' },
      { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
      { code: '+32', country: 'Belgium', flag: '🇧🇪' },
      { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
      { code: '+46', country: 'Sweden', flag: '🇸🇪' },
      { code: '+45', country: 'Denmark', flag: '🇩🇰' },
      { code: '+47', country: 'Norway', flag: '🇳🇴' },
      { code: '+358', country: 'Finland', flag: '🇫🇮' },
      { code: '+43', country: 'Austria', flag: '🇦🇹' },
      { code: '+48', country: 'Poland', flag: '🇵🇱' },
      { code: '+420', country: 'Czech Republic', flag: '🇨🇿' },
    ]
  },
  {
    region: 'Asia',
    countries: [
      { code: '+86', country: 'China', flag: '🇨🇳' },
      { code: '+91', country: 'India', flag: '🇮🇳' },
      { code: '+81', country: 'Japan', flag: '🇯🇵' },
      { code: '+82', country: 'South Korea', flag: '🇰🇷' },
      { code: '+65', country: 'Singapore', flag: '🇸🇬' },
      { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
      { code: '+66', country: 'Thailand', flag: '🇹🇭' },
      { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
      { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
      { code: '+63', country: 'Philippines', flag: '🇵🇭' },
    ]
  },
  {
    region: 'Oceania',
    countries: [
      { code: '+61', country: 'Australia', flag: '🇦🇺' },
      { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
    ]
  },
  {
    region: 'South America',
    countries: [
      { code: '+55', country: 'Brazil', flag: '🇧🇷' },
      { code: '+54', country: 'Argentina', flag: '🇦🇷' },
      { code: '+56', country: 'Chile', flag: '🇨🇱' },
      { code: '+57', country: 'Colombia', flag: '🇨🇴' },
      { code: '+51', country: 'Peru', flag: '🇵🇪' },
    ]
  },
  {
    region: 'Africa',
    countries: [
      { code: '+27', country: 'South Africa', flag: '🇿🇦' },
      { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
      { code: '+254', country: 'Kenya', flag: '🇰🇪' },
      { code: '+233', country: 'Ghana', flag: '🇬🇭' },
      { code: '+251', country: 'Ethiopia', flag: '🇪🇹' },
    ]
  }
];

// Address types
const addressTypes = [
  'Home',
  'Work',
  'Apartment',
  'Villa',
  'Office',
  'Other'
];

// validation schema for the signup form
const validationSchema = yup.object({
  username: yup.string().required('Username is required'),
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  countryCode: yup.string().required('Country code is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  addressType: yup.string().required('Address type is required'),
  streetNumber: yup.string().required('Street number is required'),
  streetName: yup.string().required('Street name is required'),
  district: yup.string().required('District is required'),
  city: yup.string().required('City is required'),
  postalCode: yup.string().required('Postal code is required'),
  currentPosition: yup.string().when('userType', {
    is: 'hiring manager',
    then: (schema) => schema.required('Current position is required'),
  }),
  company: yup.string().when('userType', {
    is: 'hiring manager',
    then: (schema) => schema.required('Company is required'),
  }),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: yup.string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

// Add this function after the validationSchema
const validateStep = (stepIndex, values) => {
  switch (stepIndex) {
    case 0: // Account Type
      return values.userType ? true : false;
    case 1: // Personal Information
      return values.username && values.fullName ? true : false;
    case 2: // Contact Information
      return values.email && values.phoneNumber && values.countryCode ? true : false;
    case 3: // Address Information
      return values.addressType && values.streetNumber && values.streetName && 
             values.district && values.city && values.postalCode ? true : false;
    case 4: // Security
      return values.password && values.confirmPassword ? true : false;
    default:
      return false;
  }
};

// signup page component
function Signup() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedType, setSelectedType] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPasswordMatch, setShowPasswordMatch] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);
      
      // Format phone number - remove all non-digit characters
      const formattedPhoneNumber = values.phoneNumber.replace(/\D/g, '');
      
      // Format address
      const formattedAddress = `${values.addressType}, ${values.streetNumber} ${values.streetName}, ${values.district}, ${values.city}, ${values.postalCode}`;
      
      const userData = {
        ...values,
        phoneNumber: formattedPhoneNumber,
        Address: formattedAddress
      };

      // Log the backend URL and request data
      console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);
      console.log("Request data:", userData);

      // Check if backend URL is configured
      if (!import.meta.env.VITE_BACKEND_URL) {
        throw new Error("Backend URL is not configured. Please check your .env file.");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000, // 5 second timeout
        }
      );

      console.log("Server response:", response.data);

      if (response.data.message === 'User created successfully') {
        setSnackbar({
          open: true,
          message: 'Account created successfully! Welcome to Mustakbalak. Redirecting to login...',
          severity: 'success'
        });
        
        // Show success toast
        toast.success('Account created successfully! Welcome to Mustakbalak.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Redirect after a delay
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.error("Signup error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });

      let errorMessage = "Failed to create account. ";
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage += "Cannot connect to the server. Please check if the backend server is running.";
      } else if (error.code === 'ECONNABORTED') {
        errorMessage += "Request timed out. Please try again.";
      } else if (error.response) {
        errorMessage += error.response.data?.error || error.response.data?.message || "Please try again.";
      } else if (error.message.includes("Backend URL is not configured")) {
        errorMessage = error.message;
      } else {
        errorMessage += "Please try again.";
      }

      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });

      // Show error toast
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
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      fullName: '',
      email: '',
      countryCode: '+966',
      phoneNumber: '',
      addressType: '',
      streetNumber: '',
      streetName: '',
      district: '',
      city: '',
      postalCode: '',
      userType: '',
      currentPosition: '',
      company: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleBackClick = () => {
    setSelectedType(null);
    formik.resetForm();
    setPasswordStrength(0);
    setShowPasswordMatch(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setCountrySearch('');
  };

  const handlePasswordChange = (e) => {
    formik.handleChange(e);
    setPasswordStrength(getPasswordStrength(e.target.value));
  };

  const handleConfirmPasswordChange = (e) => {
    formik.handleChange(e);
    setShowPasswordMatch(true);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    formik.setFieldValue('userType', type);
  };

  const handleCountrySearch = (event) => {
    setCountrySearch(event.target.value);
  };

  const filteredCountries = countryCodes.map(group => ({
    ...group,
    countries: group.countries.filter(country => 
      country.country.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.code.includes(countrySearch)
    )
  })).filter(group => group.countries.length > 0);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const steps = [
    {
      label: 'Account Type',
      icon: <AccountCircle />,
      content: (
        <Box className="type-selection-cards">
          <Card className="type-card" onClick={() => handleTypeSelect('job_seeker')}>
            <CardActionArea>
              <CardContent>
                <Search className="type-icon" />
                <Typography variant="h6">Job Seeker</Typography>
                <Typography variant="body2" color="text.secondary">
                  Looking for job opportunities? Create an account to start your job search.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card className="type-card" onClick={() => navigate('/hiring-manager/signup')}>
            <CardActionArea>
              <CardContent>
                <BusinessCenter className="type-icon" />
                <Typography variant="h6">Hiring Manager</Typography>
                <Typography variant="body2" color="text.secondary">
                  Need to hire talent? Create an account to post jobs and find candidates.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      )
    },
    {
      label: 'Personal Information',
      icon: <Person />,
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
                    <Person />
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
                    <Person />
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
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              className="form-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
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
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }}
                >
                  <ListSubheader>
                    <TextField
                      size="small"
                      autoFocus
                      placeholder="Search country..."
                      fullWidth
                      value={countrySearch}
                      onChange={handleCountrySearch}
                      onKeyDown={(e) => {
                        if (e.key !== 'Escape') {
                          e.stopPropagation();
                        }
                      }}
                    />
                  </ListSubheader>
                  {filteredCountries.map((group) => [
                    <ListSubheader key={group.region}>
                      {group.region}
                    </ListSubheader>,
                    group.countries.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>{country.flag}</span>
                          <span>{country.country}</span>
                          <span style={{ marginLeft: 'auto', color: '#666' }}>{country.code}</span>
                        </Box>
                      </MenuItem>
                    ))
                  ])}
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
                      <Phone />
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
            <LocationOn /> Address Details
          </Typography>
          <Grid container spacing={2} className="address-grid">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth className="address-field">
                <InputLabel>Address Type</InputLabel>
                <Select
                  name="addressType"
                  value={formik.values.addressType}
                  onChange={formik.handleChange}
                  label="Address Type"
                  error={formik.touched.addressType && Boolean(formik.errors.addressType)}
                >
                  {addressTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.addressType && formik.errors.addressType && (
                  <FormHelperText error>{formik.errors.addressType}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="streetNumber"
                label="Street Number"
                value={formik.values.streetNumber}
                onChange={formik.handleChange}
                error={formik.touched.streetNumber && Boolean(formik.errors.streetNumber)}
                helperText={formik.touched.streetNumber && formik.errors.streetNumber}
                className="address-field"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="streetName"
                label="Street Name"
                value={formik.values.streetName}
                onChange={formik.handleChange}
                error={formik.touched.streetName && Boolean(formik.errors.streetName)}
                helperText={formik.touched.streetName && formik.errors.streetName}
                className="address-field"
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
                name="district"
                label="District"
                value={formik.values.district}
                onChange={formik.handleChange}
                error={formik.touched.district && Boolean(formik.errors.district)}
                helperText={formik.touched.district && formik.errors.district}
                className="address-field"
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
                name="city"
                label="City"
                value={formik.values.city}
                onChange={formik.handleChange}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
                className="address-field"
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
                name="postalCode"
                label="Postal Code"
                value={formik.values.postalCode}
                onChange={formik.handleChange}
                error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
                helperText={formik.touched.postalCode && formik.errors.postalCode}
                className="address-field"
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
                      <Lock />
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
              onChange={handleConfirmPasswordChange}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              className="form-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
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

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  if (!selectedType) {
    return (
      <Container className="signup-container">
        <Paper elevation={3} className="signup-paper type-selection">
          <Typography variant="h4" className="signup-title">
            Choose Account Type
          </Typography>
          <Box className="type-selection-cards">
            <Card className="type-card" onClick={() => handleTypeSelect('job_seeker')}>
              <CardActionArea>
                <CardContent>
                  <Search className="type-icon" />
                  <Typography variant="h6">Job Seeker</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Looking for job opportunities? Create an account to start your job search.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>

            <Card className="type-card" onClick={() => navigate('/hiring-manager/signup')}>
              <CardActionArea>
                <CardContent>
                  <BusinessCenter className="type-icon" />
                  <Typography variant="h6">Hiring Manager</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Need to hire talent? Create an account to post jobs and find candidates.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        </Paper>
        <ToastContainer />
      </Container>
    );
  }

  return (
    <Container className="signup-container">
      <Paper elevation={3} className="signup-paper">
        <Typography variant="h4" className="signup-title">
          Create Your Account
        </Typography>

        <Stepper activeStep={activeStep} orientation="vertical" className="signup-stepper">
          {steps.map((step, index) => {
            const isStepValid = validateStep(index, formik.values);
            const isStepError = formik.touched[Object.keys(formik.values)[index]] && 
                               Boolean(formik.errors[Object.keys(formik.values)[index]]);

            return (
              <Step key={step.label} completed={isStepValid} error={isStepError}>
                <StepLabel
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
                      {activeStep === steps.length - 1 ? 'Sign Up' : 'Next'}
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{
              width: '100%',
              backgroundColor: snackbar.severity === 'success' ? '#2e7d32' : '#d32f2f',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            }}
            icon={snackbar.severity === 'success' ? <CheckCircle /> : undefined}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
      <ToastContainer />
    </Container>
  );
}

export default Signup;
