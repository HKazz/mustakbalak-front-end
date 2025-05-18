import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  Collapse
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Work as WorkIcon,
  LocationOn as LocationOnIcon,
  AttachMoney as AttachMoneyIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../style/ManageJobs.css';

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your jobs');
        toast.error('Authentication required');
        navigate('/login');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/jobs/hiring-manager/me`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        setJobs(response.data);
        setError(null);
      } else {
        setError('No jobs found');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        toast.error('Session expired');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (err.response?.status === 403) {
        setError('Access denied. Only hiring managers can view this page.');
        toast.error('Access denied');
      } else {
        setError('Failed to fetch jobs. Please try again later.');
        toast.error('Failed to fetch jobs');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, job) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  const handleEdit = (job) => {
    handleMenuClose();
    navigate(`/hiring-manager/jobs/edit/${job._id}`);
  };

  const handleDeleteClick = (job) => {
    handleMenuClose();
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/jobs/${jobToDelete._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setJobs(jobs.filter(job => job._id !== jobToDelete._id));
      toast.success('Job deleted successfully');
    } catch (err) {
      console.error('Error deleting job:', err);
      toast.error('Failed to delete job');
    } finally {
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    }
  };

  const handleCreateJob = () => {
    navigate('/hiring-manager/jobs/create');
  };

  const formatSalary = (job) => {
    return `${job.salary.currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`;
  };

  const handleJobClick = (jobId) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
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
    <Container maxWidth="lg" className="manage-jobs-container">
      <Box className="page-header">
        <Typography variant="h4" component="h1" className="page-title">
          Manage Jobs
        </Typography>
        <Button
          variant="contained"
          startIcon={<WorkIcon />}
          onClick={handleCreateJob}
          className="create-job-button"
        >
          Create New Job
        </Button>
      </Box>

      {jobs.length === 0 ? (
        <Paper className="empty-state">
          <WorkIcon className="empty-state-icon" />
          <Typography variant="h6" className="empty-state-title">
            No jobs posted yet
          </Typography>
          <Typography variant="body1" className="empty-state-description">
            Start by creating your first job posting
          </Typography>
          <Button
            variant="contained"
            startIcon={<WorkIcon />}
            onClick={handleCreateJob}
            className="create-job-button"
          >
            Create Your First Job
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid item xs={12} key={job._id}>
              <Card className="job-card">
                <CardContent 
                  className="job-card-content"
                  onClick={() => handleJobClick(job._id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Box className="job-header">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <WorkIcon className="job-info-icon" />
                      <Box>
                        <Typography variant="h6" className="job-title">
                          {job.title}
                        </Typography>
                        <Box className="job-info">
                          <BusinessIcon className="job-info-icon" />
                          <Typography variant="body2">{job.company}</Typography>
                        </Box>
                      </Box>
                    </Box>
                    <IconButton>
                      {expandedJob === job._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>

                  <Collapse in={expandedJob === job._id}>
                    <Box sx={{ mt: 2 }}>
                      <Box className="job-info">
                        <LocationOnIcon className="job-info-icon" />
                        <Typography variant="body2">{job.location}</Typography>
                      </Box>
                      <Box className="job-info">
                        <AttachMoneyIcon className="job-info-icon" />
                        <Typography variant="body2">{formatSalary(job)}</Typography>
                      </Box>
                      <Box className="job-info">
                        <SchoolIcon className="job-info-icon" />
                        <Typography variant="body2">{job.education}</Typography>
                      </Box>
                      <Box className="job-info">
                        <Typography variant="body2">
                          Posted: {new Date(job.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" className="job-description">
                        {job.description}
                      </Typography>
                      <Box className="job-tags">
                        <Chip
                          label={job.type}
                          size="small"
                          className="job-tag"
                        />
                        <Chip
                          label={job.experience}
                          size="small"
                          className="job-tag"
                        />
                        <Chip
                          label={job.status}
                          size="small"
                          color={job.status === 'Active' ? 'success' : 'default'}
                          className="job-tag"
                        />
                      </Box>
                    </Box>
                  </Collapse>
                </CardContent>
                <CardActions className="job-actions">
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(job);
                    }}
                    className="action-button edit-button"
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(job);
                    }}
                    className="action-button delete-button"
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        className="delete-dialog"
      >
        <DialogTitle className="delete-dialog-title">Delete Job</DialogTitle>
        <DialogContent className="delete-dialog-content">
          <Typography>
            Are you sure you want to delete this job posting? This action cannot be undone.
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

      {/* Job Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={(e) => {
          e.stopPropagation();
          handleEdit(selectedJob);
        }}>
          <EditIcon sx={{ mr: 1 }} /> Edit Job
        </MenuItem>
        <MenuItem onClick={(e) => {
          e.stopPropagation();
          handleDeleteClick(selectedJob);
        }} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete Job
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default ManageJobs; 