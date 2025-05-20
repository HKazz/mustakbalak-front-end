import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

// Memoized components
const ProfileHeader = React.memo(({ profileData, user, onEdit, onDelete }) => (
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
      <Avatar className="profile-avatar">
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
        onClick={onEdit}
              startIcon={<EditIcon />}
            >
              Edit Profile
            </Button>
            <Button
              className="delete-button"
              variant="outlined"
              color="error"
        onClick={onDelete}
              startIcon={<DeleteIcon />}
            >
              Delete Profile
            </Button>
          </Box>
        </Box>
));

const BasicInfo = React.memo(({ profileData, user, formatDate }) => (
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
));

const Education = React.memo(({ education, formatDate }) => (
            <Card className="profile-card">
              <CardContent className="section-content">
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon className="icon-wrapper" sx={{ fontSize: 28 }} />
                  <Typography className="section-title" variant="h6">
                    Education
                  </Typography>
                </Box>
      {education && education.length > 0 ? (
        education.map((edu, index) => (
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
                Graduated: {edu.graduationDate ? formatDate(new Date(edu.graduationDate)) : 'Not specified'}
                        </Typography>
                      </Box>
                      {edu.description && (
                        <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                          {edu.description}
                        </Typography>
                      )}
            {index < education.length - 1 && <Divider className="divider" />}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No education information provided
                  </Typography>
                )}
              </CardContent>
            </Card>
));

const Experience = React.memo(({ experience, formatDate }) => (
            <Card className="profile-card">
              <CardContent className="section-content">
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WorkIcon className="icon-wrapper" sx={{ fontSize: 28 }} />
                  <Typography className="section-title" variant="h6">
                    Work Experience
                  </Typography>
                </Box>
      {experience && experience.length > 0 ? (
        experience.map((exp, index) => (
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
            {index < experience.length - 1 && <Divider className="divider" />}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No work experience provided
                  </Typography>
                )}
              </CardContent>
            </Card>
));

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

  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = dateString instanceof Date ? dateString : new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        setError('Authentication error. Please log in again.');
        setLoading(false);
        navigate(user?.userType === 'hiring_manager' ? '/hiring-manager/login' : '/login');
        return;
      }

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

      const profileData = user?.userType === 'hiring_manager' 
        ? response.data 
        : response.data.user;

      setProfileData(profileData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to fetch profile');
      setLoading(false);
      if (err.response?.status === 401) {
        navigate(user?.userType === 'hiring_manager' ? '/hiring-manager/login' : '/login');
      }
    }
  }, [navigate, user?.userType]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (location.state?.from === 'complete-profile') {
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      });
    }
  }, [location]);

  const handleEditProfile = useCallback(() => {
    try {
      if (!user) {
        setError('Authentication error. Please log in again.');
        return;
      }

      const editPath = user.userType === 'hiring_manager' 
        ? '/hiring-manager/complete-profile' 
        : '/job-seeker/complete-profile';

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
  }, [navigate, user, profileData]);

  const handleDeleteClick = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteProfile = useCallback(async () => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication error. Please log in again.');
        return;
      }

      const endpoint = user?.userType === 'hiring_manager'
        ? `${import.meta.env.VITE_BACKEND_URL}/api/hiring-manager/profile`
        : `${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`;

      const response = await axios.delete(
        endpoint,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        setSnackbar({
          open: true,
          message: 'Profile deleted successfully! Redirecting to complete profile...',
          severity: 'success'
        });

        setTimeout(() => {
          localStorage.removeItem('token');
          logout();
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
  }, [navigate, user?.userType, logout]);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

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

  return (
    <Container className="page-container">
      <Typography variant="h4" component="h1" gutterBottom>
        {user?.userType === 'hiring_manager' ? 'Hiring Manager Profile' : 'Profile'}
                  </Typography>
      <Paper className="profile-card" elevation={3}>
        <ProfileHeader
          profileData={profileData}
          user={user}
          onEdit={handleEditProfile}
          onDelete={handleDeleteClick}
        />
        <BasicInfo 
          profileData={profileData} 
          user={user} 
          formatDate={formatDate}
        />
        {user?.userType !== 'hiring_manager' && (
          <>
            <Education 
              education={profileData.education} 
              formatDate={formatDate}
            />
            <Experience 
              experience={profileData.experience} 
              formatDate={formatDate}
            />
          </>
        )}
      </Paper>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
        <DialogTitle>Delete Profile</DialogTitle>
          <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your profile? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDeleteProfile}
              color="error"
              disabled={deleteLoading}
            >
              {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Container>
  );
}

export default Profile; 