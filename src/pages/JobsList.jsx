import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Collapse
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon,
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import '../style/ManageJobs.css';

const JobsList = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/jobs/hiring-manager/me`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setJobs(response.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch jobs';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Delete from database
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/jobs/${jobToDelete._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.message === 'Job deleted successfully') {
        // Remove from frontend state
        setJobs(jobs.filter(job => job._id !== jobToDelete._id));
        
        // Close dialog first
        setDeleteDialogOpen(false);
        setJobToDelete(null);

        // Show success message after dialog closes
        setTimeout(() => {
          toast.success('Job deleted successfully', {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: {
              background: '#4caf50',
              color: 'white',
              fontSize: '14px',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }
          });
        }, 100);
      } else {
        throw new Error('Failed to delete job');
      }
    } catch (err) {
      console.error('Error deleting job:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete job';
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 2000,
        style: {
          background: '#f44336',
          color: 'white',
          fontSize: '14px',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'closed':
        return 'error';
      case 'draft':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className="manage-jobs-container">
      <Box className="page-header">
        <Typography variant="h4" component="h1" className="page-title">
          My Job Postings
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/hiring-manager/jobs/create')}
          className="create-job-button"
        >
          Post New Job
        </Button>
      </Box>

      {error && (
        <Alert severity="error" className="error-alert">
          {error}
        </Alert>
      )}

      {jobs.length === 0 ? (
        <Box className="empty-state">
          <WorkIcon className="empty-state-icon" />
          <Typography variant="h6" className="empty-state-title">
            No Jobs Posted Yet
          </Typography>
          <Typography variant="body1" className="empty-state-description">
            Start by posting your first job opening to attract potential candidates.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/hiring-manager/jobs/create')}
            className="create-job-button"
          >
            Post Your First Job
          </Button>
        </Box>
      ) : (
        <Box>
          {jobs.map((job) => (
            <Card 
              key={job._id} 
              className="job-card"
              onClick={() => handleJobClick(job)}
            >
              <CardContent className="job-card-content">
                <Box className="job-header">
                  <Typography variant="h6" className="job-title">
                    {job.title}
                  </Typography>
                </Box>
                <IconButton className="job-info-icon">
                  <ExpandMoreIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Job Details Modal */}
      <Dialog
        open={!!selectedJob}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: 'job-details-modal'
        }}
      >
        {selectedJob && (
          <>
            <DialogTitle className="modal-header">
              <Typography variant="h5" className="modal-title">
                {selectedJob.title}
              </Typography>
              <IconButton onClick={handleCloseModal} className="modal-close-button">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box className="job-details-container">
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Card className="job-details-card">
                      <CardContent>
                        <Typography variant="h6" className="job-details-title">
                          Job Details
                        </Typography>
                        <Box className="job-details-grid">
                          <Box className="job-details-item">
                            <LocationIcon className="job-details-icon" />
                            <Box>
                              <Typography variant="subtitle2" color="textSecondary">
                                Location
                              </Typography>
                              <Typography variant="body1">{selectedJob.location}</Typography>
                            </Box>
                          </Box>
                          <Box className="job-details-item">
                            <MoneyIcon className="job-details-icon" />
                            <Box>
                              <Typography variant="subtitle2" color="textSecondary">
                                Salary Range
                              </Typography>
                              <Typography variant="body1">
                                {selectedJob.salary.currency} {selectedJob.salary.min.toLocaleString()} - {selectedJob.salary.max.toLocaleString()}
                              </Typography>
                            </Box>
                          </Box>
                          <Box className="job-details-item">
                            <SchoolIcon className="job-details-icon" />
                            <Box>
                              <Typography variant="subtitle2" color="textSecondary">
                                Education
                              </Typography>
                              <Typography variant="body1">{selectedJob.education}</Typography>
                            </Box>
                          </Box>
                          <Box className="job-details-item">
                            <StarIcon className="job-details-icon" />
                            <Box>
                              <Typography variant="subtitle2" color="textSecondary">
                                Experience
                              </Typography>
                              <Typography variant="body1">{selectedJob.experience}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>

                    <Card className="job-description-card">
                      <CardContent>
                        <Typography variant="h6" className="job-details-title">
                          Job Description
                        </Typography>
                        <Typography variant="body1" className="job-description">
                          {selectedJob.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Card className="job-sidebar-card">
                      <CardContent>
                        <Typography variant="h6" className="job-details-title">
                          Skills & Status
                        </Typography>
                        <Box className="job-tags">
                          {selectedJob.skills.map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              size="small"
                              className="job-tag"
                            />
                          ))}
                          <Chip
                            label={selectedJob.status}
                            size="small"
                            color={getStatusColor(selectedJob.status)}
                            className="job-tag"
                          />
                        </Box>
                        <Box className="job-actions">
                          <Button
                            fullWidth
                            startIcon={<EditIcon />}
                            onClick={() => navigate(`/hiring-manager/jobs/edit/${selectedJob._id}`)}
                            className="action-button edit-button"
                          >
                            Edit Job
                          </Button>
                          <Button
                            fullWidth
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteClick(selectedJob)}
                            className="action-button delete-button"
                          >
                            Delete Job
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        className="delete-dialog"
      >
        <DialogTitle className="delete-dialog-title">Delete Job</DialogTitle>
        <DialogContent className="delete-dialog-content">
          <Typography>
            Are you sure you want to delete the job "{jobToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions className="delete-dialog-actions">
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobsList; 