import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import '../style/HiringManagerApplications.css';

const HiringManagerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/applications/hiring-manager`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setApplications(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applications');
      setLoading(false);
    }
  };

  const handleApplicationClick = (application) => {
    setSelectedApplication(application);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedApplication(null);
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/applications/${applicationId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Update the applications list
      setApplications(applications.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      // Update the selected application if it's open
      if (selectedApplication?._id === applicationId) {
        setSelectedApplication({ ...selectedApplication, status: newStatus });
      }
      
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update application status');
    }
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    if (selectedApplication) {
      await handleStatusUpdate(selectedApplication._id, newStatus);
    }
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
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        className="page-title"
      >
        Job Applications
      </Typography>

      <Grid container spacing={3}>
        {applications.length === 0 ? (
          <Grid item xs={12}>
            <Paper className="no-applications">
              <DescriptionIcon sx={{ fontSize: 48, color: '#666', mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                No applications yet
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                You haven't received any applications for your posted jobs yet.
              </Typography>
            </Paper>
          </Grid>
        ) : (
          applications.map((application) => (
            <Grid item xs={12} key={application._id}>
              <Card 
                className="application-card"
                onClick={() => handleApplicationClick(application)}
              >
                <CardContent>
                  <Box className="application-header">
                    <Box className="application-info">
                      <Box className="job-info">
                        <WorkIcon className="info-icon" />
                        <Typography variant="h6">
                          {application.job.title}
                        </Typography>
                      </Box>
                      <Box className="applicant-info">
                        <PersonIcon className="info-icon" />
                        <Typography variant="subtitle1">
                          {application.applicant.name}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={application.status}
                      className={`status-chip ${application.status.toLowerCase()}`}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Application Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        className="application-dialog"
      >
        {selectedApplication && (
          <>
            <DialogTitle className="dialog-title">
              <Box className="dialog-header">
                <Typography variant="h5">Application Details</Typography>
                <IconButton onClick={handleCloseDialog} className="close-button">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box className="dialog-content">
                <Box className="job-info-section">
                  <Typography variant="h6" gutterBottom>Job Details</Typography>
                  <Box className="job-meta">
                    <Box className="meta-item">
                      <WorkIcon className="dialog-icon" />
                      <Typography>{selectedApplication.job.title}</Typography>
                    </Box>
                    <Box className="meta-item">
                      <BusinessIcon className="dialog-icon" />
                      <Typography>{selectedApplication.job.company}</Typography>
                    </Box>
                    <Chip
                      label={selectedApplication.job.type}
                      className="job-type-chip"
                    />
                  </Box>
                </Box>

                <Divider className="dialog-divider" />

                <Box className="applicant-info-section">
                  <Typography variant="h6" gutterBottom>Applicant Information</Typography>
                  <Box className="applicant-meta">
                    <Box className="meta-item">
                      <PersonIcon className="dialog-icon" />
                      <Typography>{selectedApplication.applicant.name}</Typography>
                    </Box>
                    <Box className="meta-item">
                      <EmailIcon className="dialog-icon" />
                      <Typography>{selectedApplication.applicant.email}</Typography>
                    </Box>
                    <Box className="meta-item">
                      <PhoneIcon className="dialog-icon" />
                      <Typography>{selectedApplication.applicant.phone}</Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider className="dialog-divider" />

                <Box className="application-status-section">
                  <Typography variant="h6" gutterBottom>Application Status</Typography>
                  <Chip
                    label={selectedApplication.status}
                    className={`status-chip ${selectedApplication.status.toLowerCase()}`}
                  />
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'flex-end' }}>
                <Button
                  onClick={handleCloseDialog}
                  variant="outlined"
                  sx={{ minWidth: 100 }}
                >
                  Close
                </Button>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Select
                    value={selectedApplication?.status || 'Pending'}
                    onChange={handleStatusChange}
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="Pending">
                      <Chip
                        label="Pending"
                        size="small"
                        sx={{
                          backgroundColor: '#fff3e0',
                          color: '#e65100',
                          width: '100%'
                        }}
                      />
                    </MenuItem>
                    <MenuItem value="Accepted">
                      <Chip
                        label="Accepted"
                        size="small"
                        sx={{
                          backgroundColor: '#e8f5e9',
                          color: '#2e7d32',
                          width: '100%'
                        }}
                      />
                    </MenuItem>
                    <MenuItem value="Rejected">
                      <Chip
                        label="Rejected"
                        size="small"
                        sx={{
                          backgroundColor: '#ffebee',
                          color: '#c62828',
                          width: '100%'
                        }}
                      />
                    </MenuItem>
                  </Select>
                  <Button
                    onClick={handleStatusChange}
                    variant="contained"
                    color="primary"
                    sx={{ minWidth: 100 }}
                  >
                    Update Status
                  </Button>
                </Box>
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default HiringManagerApplications; 