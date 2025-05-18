import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Work, Business, Phone, Email, LocationOn, Person } from '@mui/icons-material';

const steps = ['Personal Information', 'Company Details', 'Address Information'];

const HiringManagerCompleteProfile = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    currentPosition: '',
    company: '',
    department: '',
    role: '',
    companySize: '',
    industry: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    }
  });

  const roles = [
    'recruiter',
    'hiring manager',
    'talent acquisition',
    'hr manager'
  ];

  const companySizes = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+'
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Other'
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        navigate('/hiring-manager/login');
        return;
      }

      console.log('Attempting to fetch profile with token:', token.substring(0, 20) + '...');
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/hiring-manager/profile`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('Profile response status:', response.status);
      console.log('Profile data received:', response.data);

      if (!response.data || !response.data.user) {
        throw new Error('No data received from server');
      }

      const profileData = response.data.user;

      // Initialize profile with received data
      setProfile({
        fullName: profileData.fullName || '',
        email: profileData.email || '',
        phoneNumber: profileData.phoneNumber || '',
        currentPosition: profileData.currentPosition || '',
        company: profileData.company || '',
        department: profileData.department || '',
        role: profileData.role || '',
        companySize: profileData.companySize || '',
        industry: profileData.industry || '',
        address: profileData.address || {
          street: '',
          city: '',
          state: '',
          country: '',
          postalCode: ''
        }
      });

      setLoading(false);
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });

      if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/hiring-manager/login');
      } else {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to load profile data. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only proceed if we're on the last step
    if (activeStep !== steps.length - 1) {
      handleNext();
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Validate required fields
      const requiredFields = [
        'fullName',
        'phoneNumber',
        'currentPosition',
        'role',
        'company',
        'department',
        'companySize',
        'industry'
      ];

      const missingFields = requiredFields.filter(field => !profile[field]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Validate address fields
      const requiredAddressFields = ['street', 'city', 'state', 'country', 'postalCode'];
      const missingAddressFields = requiredAddressFields.filter(field => !profile.address[field]);
      if (missingAddressFields.length > 0) {
        throw new Error(`Please fill in all address fields: ${missingAddressFields.join(', ')}`);
      }

      // Prepare the profile data according to the backend model
      const profileData = {
        fullName: profile.fullName.trim(),
        phoneNumber: profile.phoneNumber.trim(),
        currentPosition: profile.currentPosition.trim(),
        company: profile.company.trim(),
        department: profile.department.trim(),
        role: profile.role,
        companySize: profile.companySize,
        industry: profile.industry,
        address: {
          street: profile.address.street.trim(),
          city: profile.address.city.trim(),
          state: profile.address.state.trim(),
          country: profile.address.country.trim(),
          postalCode: profile.address.postalCode.trim()
        }
      };

      console.log('Sending profile data:', profileData);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/hiring-manager/complete-profile`,
        profileData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Profile update response:', response.data);

      if (response.data) {
        // Update localStorage with new user data
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUserData = {
          ...userData,
          ...response.data.user,
          profileCompleted: true
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));

        setShowSuccessDialog(true);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url,
        headers: err.config?.headers
      });

      let errorMessage = 'Failed to update profile';
      
      if (err.response) {
        errorMessage = err.response.data?.error || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your internet connection.';
      } else {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (activeStep === 0) {
      // Validate Personal Information
      if (!profile.fullName || !profile.phoneNumber || !profile.currentPosition || !profile.role) {
        setError('Please fill in all required fields in Personal Information');
        return;
      }
    } else if (activeStep === 1) {
      // Validate Company Details
      if (!profile.company || !profile.department || !profile.companySize || !profile.industry) {
        setError('Please fill in all required fields in Company Details');
        return;
      }
    }
    
    setError(null);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleViewProfile = () => {
    setShowSuccessDialog(false);
    navigate('/hiring-manager/profile', { replace: true });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Full Name"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Phone Number"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Current Position"
                name="currentPosition"
                value={profile.currentPosition}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Work sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={profile.role}
                  onChange={handleChange}
                  label="Role"
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Company"
                name="company"
                value={profile.company}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Department"
                name="department"
                value={profile.department}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Company Size</InputLabel>
                <Select
                  name="companySize"
                  value={profile.companySize}
                  onChange={handleChange}
                  label="Company Size"
                >
                  {companySizes.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size} employees
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Industry</InputLabel>
                <Select
                  name="industry"
                  value={profile.industry}
                  onChange={handleChange}
                  label="Industry"
                >
                  {industries.map((industry) => (
                    <MenuItem key={industry} value={industry}>
                      {industry}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Street"
                name="address.street"
                value={profile.address.street}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="City"
                name="address.city"
                value={profile.address.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="State"
                name="address.state"
                value={profile.address.state}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Country"
                name="address.country"
                value={profile.address.country}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Postal Code"
                name="address.postalCode"
                value={profile.address.postalCode}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Complete Your Profile
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom align="center">
          Please provide the following information to complete your profile
        </Typography>

        <Stepper activeStep={activeStep} sx={{ my: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {getStepContent(activeStep)}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                sx={{ bgcolor: '#0a66c2', '&:hover': { bgcolor: '#004182' } }}
              >
                {saving ? 'Saving...' : 'Complete Profile'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ bgcolor: '#0a66c2', '&:hover': { bgcolor: '#004182' } }}
              >
                Next
              </Button>
            )}
          </Box>
        </form>
      </Paper>

      {/* Success Dialog */}
      <Dialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#0a66c2', color: 'white' }}>
          Profile Completed Successfully!
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Your profile has been successfully completed. You can now view and edit your profile details.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleViewProfile}
            variant="contained"
            sx={{ bgcolor: '#0a66c2', '&:hover': { bgcolor: '#004182' } }}
          >
            View Profile
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HiringManagerCompleteProfile; 