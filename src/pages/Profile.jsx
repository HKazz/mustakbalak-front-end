import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Fade,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar
} from '@mui/material';
import {
  School as SchoolIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowForwardIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Flag as FlagIcon,
  Cake as CakeIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Badge as BadgeIcon,
  Interests as InterestsIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import '../style/Profile.css';

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage');
          setError('Authentication error. Please log in again.');
          setLoading(false);
          // Redirect to appropriate login page based on user type
          navigate(user?.userType === 'hiring_manager' ? '/hiring-manager/login' : '/login');
          return;
        }

        // Determine the correct endpoint based on user type
        const endpoint = user?.userType === 'hiring_manager' 
          ? `${import.meta.env.VITE_BACKEND_URL}/api/hiring-manager/profile`
          : `${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`;

        const response = await axios.get(
          endpoint,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.data) {
          throw new Error('No data received from server');
        }

        // Handle different response structures based on user type
        const profileData = user?.userType === 'hiring_manager' 
          ? response.data 
          : response.data.user;

        if (isMounted) {
          setProfileData(profileData);
          setOriginalData(profileData);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to fetch profile');
          setLoading(false);
          // If unauthorized, redirect to appropriate login page
          if (err.response?.status === 401) {
            navigate(user?.userType === 'hiring_manager' ? '/hiring-manager/login' : '/login');
          }
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [navigate, user?.userType]);

  useEffect(() => {
    // Show success message if redirected from complete profile
    if (location.state?.from === 'complete-profile') {
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      });
    }
  }, [location]);

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleEditProfile = () => {
    console.log('Edit button clicked');
    try {
      if (!user) {
        console.log('No user found');
        setError('Authentication error. Please log in again.');
        return;
      }

      console.log('User type:', user.userType);
      const editPath = user.userType === 'hiring_manager' 
        ? '/hiring-manager/complete-profile' 
        : '/job-seeker/complete-profile';

      console.log('Navigating to:', editPath);
      navigate(editPath, { 
        state: { 
          from: 'profile',
          profileData: profileData 
        }
      });
    } catch (err) {
      console.error('Error navigating to edit profile:', err);
      setSnackbar({
        open: true,
        message: 'Failed to navigate to edit profile. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleDeleteClick = () => {
    console.log('Delete button clicked');
    setDeleteDialogOpen(true);
  };

  const handleDeleteProfile = async () => {
    console.log('Delete profile confirmed');
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        setError('Authentication error. Please log in again.');
        return;
      }

      console.log('User type:', user?.userType);
      const endpoint = user?.userType === 'hiring_manager'
        ? `${import.meta.env.VITE_BACKEND_URL}/api/hiring-manager/profile`
        : `${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`;

      console.log('Delete endpoint:', endpoint);
      const response = await axios.delete(
        endpoint,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Delete response:', response.data);
      if (response.data) {
        setSnackbar({
          open: true,
          message: 'Profile deleted successfully! Redirecting to complete profile...',
          severity: 'success'
        });

        // Clear local storage and redirect after a short delay
        setTimeout(() => {
          localStorage.removeItem('token');
          logout();
          // Redirect to complete profile page based on user type
          navigate(user?.userType === 'hiring_manager' ? '/hiring-manager/complete-profile' : '/complete-profile');
        }, 2000);
      }
    } catch (err) {
      console.error('Error deleting profile:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete profile. Please try again.';
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <Container className="loading-container">
        <CircularProgress className="loading-spinner" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="alert-container">
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!profileData) {
    return (
      <Container className="alert-container">
        <Alert severity="info" sx={{ mb: 3 }}>
          No profile data found. Please complete your profile.
        </Alert>
      </Container>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <Container className="page-container">
      <Typography variant="h4" component="h1" gutterBottom>
        {user?.userType === 'hiring_manager' ? 'Hiring Manager Profile' : 'Profile'}
      </Typography>
      <Paper 
        className="profile-card"
        elevation={3}
      >
        {/* Header with Avatar */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          borderBottom: '2px solid #f0f0f0',
          pb: 3,
          px: 4,
          pt: 4
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              className="profile-avatar"
            >
              {profileData?.fullName?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ color: '#000000', fontWeight: 700 }}>
                {profileData?.fullName || 'User'}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {profileData?.email || ''}
              </Typography>
              {user?.userType === 'hiring_manager' && profileData?.currentPosition && (
                <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 1 }}>
                  {profileData.currentPosition} at {profileData.company}
                </Typography>
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }} className="button-container">
            <Button
              className="edit-button"
              variant="contained"
              onClick={handleEditProfile}
              startIcon={<EditIcon />}
            >
              Edit Profile
            </Button>
            <Button
              className="delete-button"
              variant="outlined"
              color="error"
              onClick={handleDeleteClick}
              startIcon={<DeleteIcon />}
            >
              Delete Profile
            </Button>
          </Box>
        </Box>

        {/* Basic Information */}
        <Card className="profile-card">
          <CardContent className="section-content">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon className="icon-wrapper" sx={{ fontSize: 28 }} />
              <Typography className="section-title" variant="h6">
                Basic Information
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box className="info-item">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon className="icon-wrapper" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                      <Typography variant="body1">{profileData?.email || 'Not specified'}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box className="info-item">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon className="icon-wrapper" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Phone Number</Typography>
                      <Typography variant="body1">{profileData?.phoneNumber || 'Not specified'}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              {user?.userType === 'hiring_manager' ? (
                <>
                  <Grid item xs={12} sm={6}>
                    <Box className="info-item">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BusinessIcon className="icon-wrapper" sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">Company</Typography>
                          <Typography variant="body1">{profileData?.company || 'Not specified'}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className="info-item">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <WorkIcon className="icon-wrapper" sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">Position</Typography>
                          <Typography variant="body1">{profileData?.currentPosition || 'Not specified'}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} sm={6}>
                    <Box className="info-item">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FlagIcon className="icon-wrapper" sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">Nationality</Typography>
                          <Typography variant="body1">{profileData?.nationality || 'Not specified'}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className="info-item">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CakeIcon className="icon-wrapper" sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">Date of Birth</Typography>
                          <Typography variant="body1">{formatDate(profileData?.DOB)}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Only show these sections for regular users */}
        {user?.userType !== 'hiring_manager' && (
          <>
            {/* Education Section */}
            <Card className="profile-card">
              <CardContent className="section-content">
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon className="icon-wrapper" sx={{ fontSize: 28 }} />
                  <Typography className="section-title" variant="h6">
                    Education
                  </Typography>
                </Box>
                {profileData.education && profileData.education.length > 0 ? (
                  profileData.education.map((edu, index) => (
                    <Box key={index} className="info-item">
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
                        {edu.degree} in {edu.field}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                        <BusinessIcon className="icon-wrapper" sx={{ fontSize: 16 }} />
                        <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                          {edu.institution}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarIcon className="icon-wrapper" sx={{ fontSize: 16 }} />
                        <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                          Graduated: {formatDate(edu.graduationDate)}
                        </Typography>
                      </Box>
                      {edu.description && (
                        <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                          {edu.description}
                        </Typography>
                      )}
                      {index < profileData.education.length - 1 && <Divider className="divider" />}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No education information provided
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Work Experience Section */}
            <Card className="profile-card">
              <CardContent className="section-content">
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WorkIcon className="icon-wrapper" sx={{ fontSize: 28 }} />
                  <Typography className="section-title" variant="h6">
                    Work Experience
                  </Typography>
                </Box>
                {profileData.experience && profileData.experience.length > 0 ? (
                  profileData.experience.map((exp, index) => (
                    <Box key={index} className="info-item">
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
                        {exp.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                        <BusinessIcon className="icon-wrapper" sx={{ fontSize: 16 }} />
                        <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                          {exp.company}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarIcon className="icon-wrapper" sx={{ fontSize: 16 }} />
                        <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                          {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </Typography>
                      </Box>
                      {exp.description && (
                        <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                          {exp.description}
                        </Typography>
                      )}
                      {index < profileData.experience.length - 1 && <Divider className="divider" />}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No work experience provided
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Certificates Section */}
            <Card className="profile-card">
              <CardContent className="section-content">
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BadgeIcon className="icon-wrapper" sx={{ fontSize: 28 }} />
                  <Typography className="section-title" variant="h6">
                    Certificates & Qualifications
                  </Typography>
                </Box>
                {profileData.certificates && profileData.certificates.length > 0 ? (
                  profileData.certificates.map((cert, index) => (
                    <Box key={index} className="info-item">
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
                        {cert.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                        <BusinessIcon className="icon-wrapper" sx={{ fontSize: 16 }} />
                        <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                          {cert.issuer}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarIcon className="icon-wrapper" sx={{ fontSize: 16 }} />
                        <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                          Issued: {formatDate(cert.date)}
                        </Typography>
                      </Box>
                      {cert.description && (
                        <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                          {cert.description}
                        </Typography>
                      )}
                      {index < profileData.certificates.length - 1 && <Divider className="divider" />}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No certificates provided
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Fields of Interest Section */}
            <Card className="profile-card">
              <CardContent className="section-content">
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InterestsIcon className="icon-wrapper" sx={{ fontSize: 28 }} />
                  <Typography className="section-title" variant="h6">
                    Fields of Interest
                  </Typography>
                </Box>
                {profileData.fields && profileData.fields.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profileData.fields.map((field, index) => (
                      <Chip
                        key={index}
                        className="chip-item"
                        label={field}
                        icon={<StarIcon />}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No fields of interest specified
                  </Typography>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title" sx={{ color: '#d32f2f' }}>
            Delete Profile
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete your profile? This action cannot be undone and all your data will be permanently deleted.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              variant="outlined"
              sx={{
                borderColor: '#666',
                color: '#666',
                '&:hover': {
                  borderColor: '#333',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteProfile}
              variant="contained"
              color="error"
              disabled={deleteLoading}
              sx={{
                backgroundColor: '#d32f2f',
                '&:hover': {
                  backgroundColor: '#b71c1c'
                }
              }}
            >
              {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success/Error Snackbar */}
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
            icon={snackbar.severity === 'success' ? <CheckCircleIcon /> : undefined}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}

export default Profile; 