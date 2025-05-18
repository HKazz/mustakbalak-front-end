import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Avatar,
  Button,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  Work as WorkIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import '../style/HiringManagerProfile.css';

const HiringManagerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/hiring-manager/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Profile response:', response.data);

      if (response.data && response.data.user) {
        setProfile(response.data.user);
      } else {
        throw new Error('No profile data received');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEdit = () => {
    navigate('/hiring-manager/complete-profile');
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({
          open: true,
          message: 'Authentication error. Please log in again.',
          severity: 'error'
        });
        return;
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/hiring-manager/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSnackbar({
        open: true,
        message: 'Profile deleted successfully',
        severity: 'success'
      });

      // Clear local storage and redirect after a short delay
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/hiring-manager/login');
      }, 2000);
    } catch (err) {
      console.error('Error deleting profile:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to delete profile',
        severity: 'error'
      });
    }
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return (
      <Box className="hiring-manager-loading-container">
        <CircularProgress className="hiring-manager-loading-spinner" />
      </Box>
    );
  }

  if (error) {
    return (
      <Container className="hiring-manager-alert-container">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container className="hiring-manager-alert-container">
        <Alert severity="info">No profile data found</Alert>
      </Container>
    );
  }

  return (
    <Container className="page-container">
      <Typography variant="h4" component="h1" gutterBottom>
        Hiring Manager Profile
      </Typography>
      <Paper elevation={3} className="hiring-manager-card">
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar className="hiring-manager-avatar">
              {profile.fullName?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom className="hiring-manager-section-title">
                {profile.fullName}
              </Typography>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkIcon className="hiring-manager-icon-wrapper" fontSize="small" />
                {profile.currentPosition} at {profile.company}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              className="hiring-manager-edit-button"
            >
              Edit Profile
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
              className="hiring-manager-edit-button"
              sx={{ 
                ml: 2,
                backgroundColor: '#d32f2f',
                '&:hover': { 
                  backgroundColor: '#b71c1c'
                }
              }}
            >
              Delete Profile
            </Button>
          </Box>
        </Box>

        <Divider className="hiring-manager-divider" />

        {/* Content Grid */}
        <Grid container spacing={4}>
          {/* Company Information Card */}
          <Grid item xs={12} md={6}>
            <Card elevation={2} className="hiring-manager-card">
              <CardContent className="hiring-manager-section-content">
                <Typography variant="h6" gutterBottom className="hiring-manager-section-title">
                  <BusinessIcon className="hiring-manager-icon-wrapper" />
                  Company Information
                </Typography>
                <Box>
                  <Box className="hiring-manager-info-item">
                    <Typography variant="subtitle2" color="text.secondary">
                      Company
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.company}
                    </Typography>
                  </Box>
                  <Box className="hiring-manager-info-item">
                    <Typography variant="subtitle2" color="text.secondary">
                      Department
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.department}
                    </Typography>
                  </Box>
                  <Box className="hiring-manager-info-item">
                    <Typography variant="subtitle2" color="text.secondary">
                      Role
                    </Typography>
                    <Chip 
                      label={profile.role} 
                      size="small"
                      className="hiring-manager-chip"
                    />
                  </Box>
                  <Box className="hiring-manager-info-item">
                    <Typography variant="subtitle2" color="text.secondary">
                      Company Size
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.companySize} employees
                    </Typography>
                  </Box>
                  <Box className="hiring-manager-info-item">
                    <Typography variant="subtitle2" color="text.secondary">
                      Industry
                    </Typography>
                    <Chip 
                      label={profile.industry} 
                      size="small"
                      className="hiring-manager-chip"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact & Address Information Card */}
          <Grid item xs={12} md={6}>
            <Card elevation={2} className="hiring-manager-card">
              <CardContent className="hiring-manager-section-content">
                <Typography variant="h6" gutterBottom className="hiring-manager-section-title">
                  <PersonIcon className="hiring-manager-icon-wrapper" />
                  Contact Information
                </Typography>
                <Box>
                  <Box className="hiring-manager-info-item">
                    <Typography variant="subtitle2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
                      <PhoneIcon className="hiring-manager-icon-wrapper" fontSize="small" />
                      {profile.phoneNumber}
                    </Typography>
                  </Box>
                  <Box className="hiring-manager-info-item">
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
                      <EmailIcon className="hiring-manager-icon-wrapper" fontSize="small" />
                      {profile.email}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="h6" gutterBottom className="hiring-manager-section-title">
                  <LocationIcon className="hiring-manager-icon-wrapper" />
                  Address
                </Typography>
                <Box>
                  <Box className="hiring-manager-info-item">
                    <Typography variant="subtitle2" color="text.secondary">
                      Street
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.address?.street}
                    </Typography>
                  </Box>
                  <Box className="hiring-manager-info-item">
                    <Typography variant="subtitle2" color="text.secondary">
                      City
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.address?.city}
                    </Typography>
                  </Box>
                  <Box className="hiring-manager-info-item">
                    <Typography variant="subtitle2" color="text.secondary">
                      State
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.address?.state}
                    </Typography>
                  </Box>
                  <Box className="hiring-manager-info-item">
                    <Typography variant="subtitle2" color="text.secondary">
                      Country
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.address?.country}
                    </Typography>
                  </Box>
                  <Box className="hiring-manager-info-item">
                    <Typography variant="subtitle2" color="text.secondary">
                      Postal Code
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.address?.postalCode}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ className: 'hiring-manager-dialog' }}
      >
        <DialogTitle className="hiring-manager-dialog-title">Delete Profile</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your profile? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          className="hiring-manager-snackbar"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HiringManagerProfile; 