import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon,
  Close as CloseIcon,
  FilterList as FilterListIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import "../style/UserApplications.css";

const UserApplications = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.userType !== 'job_seeker') {
      navigate('/login');
      return;
    }
    if (id) {
      fetchSpecificApplication(id);
    } else {
      fetchApplications();
    }
  }, [navigate, id]);

  const fetchSpecificApplication = async (applicationId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/applications/${applicationId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSelectedApplication(response.data);
      setDialogOpen(true);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching application:', err);
      setError(err.response?.data?.message || 'Failed to load application. Please try again later.');
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/applications/user`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setApplications(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.response?.data?.message || 'Failed to load applications. Please try again later.');
      setLoading(false);
    }
  };

  const handleViewJob = (application) => {
    setSelectedApplication(application);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedApplication(null);
  };

  const handleBackToJobs = () => {
    navigate('/job-showroom');
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const filteredApplications = applications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatEducation = (education) => {
    if (typeof education === 'string') return education;
    if (Array.isArray(education)) {
      return education.map(edu => `${edu.degree} in ${edu.field}`).join(', ');
    }
    return 'Education not specified';
  };

  const formatExperience = (experience) => {
    if (typeof experience === 'string') return experience;
    if (Array.isArray(experience)) {
      return experience.map(exp => `${exp.position} at ${exp.company}`).join(', ');
    }
    return 'Experience not specified';
  };

  const formatSkills = (skills) => {
    if (Array.isArray(skills)) {
      return skills.map(skill => typeof skill === 'string' ? skill : skill.name).join(', ');
    }
    return 'Skills not specified';
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Salary not specified';
    if (typeof salary === 'string') return salary;
    if (typeof salary === 'object') {
      const { min, max, currency } = salary;
      if (min && max) {
        return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
      }
      return `${currency} ${min || max}`;
    }
    return 'Salary not specified';
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container className="alert-container">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="applications-container">
      <Box className="applications-header">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToJobs}
          className="back-button"
        >
          Back to Jobs
        </Button>
        <Typography variant="h4" component="h1" className="page-title">
          My Applications
        </Typography>
      </Box>

      <Box className="filter-section">
        <FormControl className="status-filter">
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Filter by Status"
            startAdornment={<FilterListIcon className="filter-icon" />}
          >
            <MenuItem value="all">All Applications</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filteredApplications.length === 0 ? (
          <Grid item xs={12}>
            <Paper className="no-applications">
              <DescriptionIcon sx={{ fontSize: 48, color: '#666', mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                No applications found
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {statusFilter === 'all' 
                  ? "You haven't applied to any jobs yet."
                  : `No ${statusFilter} applications found.`}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleBackToJobs}
                sx={{ mt: 2 }}
              >
                Browse Jobs
              </Button>
            </Paper>
          </Grid>
        ) : (
          filteredApplications.map((application) => (
            <Grid item xs={12} key={application._id}>
              <Card className="application-card" onClick={() => handleViewJob(application)}>
                <CardContent>
                  <Box className="application-header">
                    <Box className="job-info">
                      <Box className="company-info">
                        <BusinessIcon className="info-icon" />
                        <Typography variant="h6">
                          {application.job?.company || 'Company not specified'}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={application.status}
                      color={getStatusColor(application.status)}
                      className={`status-chip status-${application.status.toLowerCase()}`}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedApplication && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Application Details</Typography>
                <IconButton onClick={handleCloseDialog} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box mb={3}>
                <Typography variant="h5" gutterBottom>
                  {selectedApplication.job?.title || 'Job title not specified'}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                  {selectedApplication.job?.company || 'Company not specified'}
                </Typography>
                <Chip
                  label={selectedApplication.status}
                  color={getStatusColor(selectedApplication.status)}
                  className={`status-chip status-${selectedApplication.status.toLowerCase()}`}
                  sx={{ mt: 1 }}
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Job Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Location
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedApplication.job?.location || 'Location not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Experience Required
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedApplication.job?.experience ? formatExperience(selectedApplication.job.experience) : 'Experience not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Education Required
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedApplication.job?.education ? formatEducation(selectedApplication.job.education) : 'Education not specified'}
                  </Typography>
                </Grid>
                {selectedApplication.job?.salary && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Salary
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {formatSalary(selectedApplication.job.salary)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Job Description
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedApplication.job?.description || 'No description available'}
              </Typography>
              {selectedApplication.job?.requirements && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Requirements
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedApplication.job.requirements}
                  </Typography>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default UserApplications; 