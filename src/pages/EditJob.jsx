import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const steps = ['Basic Information', 'Description & Requirements', 'Salary & Skills', 'Final Details'];

const EditJob = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [job, setJob] = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    salary: {
      min: '',
      max: '',
      currency: 'USD'
    },
    benefits: [''],
    skills: [''],
    experience: '',
    education: '',
    status: 'Active'
  });

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
  const educationLevels = ['High School', "Bachelor's", "Master's", 'PhD', 'Any'];
  const statusOptions = ['Active', 'Closed', 'Draft'];

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/jobs/${jobId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setJob(response.data.job);
    } catch (err) {
      console.error('Error fetching job:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch job';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setJob(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setJob(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setJob(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setJob(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setJob(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    // Validate current step
    if (activeStep === 0) {
      if (!job.title || !job.company || !job.location || !job.type) {
        setError('Please fill in all required fields in Basic Information');
        return;
      }
    } else if (activeStep === 1) {
      if (!job.description) {
        setError('Please provide a job description');
        return;
      }
      if (job.requirements.some(req => !req.trim()) || 
          job.responsibilities.some(resp => !resp.trim())) {
        setError('Please fill in all requirements and responsibilities');
        return;
      }
    } else if (activeStep === 2) {
      if (!job.salary.min || !job.salary.max) {
        setError('Please fill in both minimum and maximum salary');
        return;
      }
      if (job.skills.some(skill => !skill.trim())) {
        setError('Please fill in all skills');
        return;
      }
    }
    
    setError(null);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Validate final step
      if (!job.experience || !job.education) {
        throw new Error('Please fill in all required fields in Final Details');
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/jobs/${jobId}`,
        job,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Show success message
      toast.success('Job updated successfully! 🎉', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Navigate back to jobs list
      navigate('/hiring-manager/jobs');
    } catch (err) {
      console.error('Error updating job:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update job';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  // If job is not loaded or missing required fields, show error
  if (!job || typeof job !== 'object' || !('title' in job)) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Alert severity="error">
            Failed to load job details. Please try again or contact support.
          </Alert>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" onClick={() => window.location.reload()}>Retry</Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Job Title"
                name="title"
                value={job.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Company"
                name="company"
                value={job.company}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Location"
                name="location"
                value={job.location}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Job Type</InputLabel>
                <Select
                  name="type"
                  value={job.type}
                  onChange={handleChange}
                  label="Job Type"
                >
                  {jobTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Job Description"
                name="description"
                value={job.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Requirements
              </Typography>
              {job.requirements.map((req, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    required
                    label={`Requirement ${index + 1}`}
                    value={req}
                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                  />
                  <IconButton
                    onClick={() => removeArrayItem('requirements', index)}
                    disabled={job.requirements.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => addArrayItem('requirements')}
                sx={{ mt: 1 }}
              >
                Add Requirement
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Responsibilities
              </Typography>
              {job.responsibilities.map((resp, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    required
                    label={`Responsibility ${index + 1}`}
                    value={resp}
                    onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                  />
                  <IconButton
                    onClick={() => removeArrayItem('responsibilities', index)}
                    disabled={job.responsibilities.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => addArrayItem('responsibilities')}
                sx={{ mt: 1 }}
              >
                Add Responsibility
              </Button>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Salary Range
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Minimum Salary"
                    name="salary.min"
                    value={job.salary.min}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Maximum Salary"
                    name="salary.max"
                    value={job.salary.max}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      name="salary.currency"
                      value={job.salary.currency}
                      onChange={handleChange}
                      label="Currency"
                    >
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="EUR">EUR</MenuItem>
                      <MenuItem value="GBP">GBP</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Required Skills
              </Typography>
              {job.skills.map((skill, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    required
                    label={`Skill ${index + 1}`}
                    value={skill}
                    onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                  />
                  <IconButton
                    onClick={() => removeArrayItem('skills', index)}
                    disabled={job.skills.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => addArrayItem('skills')}
                sx={{ mt: 1 }}
              >
                Add Skill
              </Button>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  name="experience"
                  value={job.experience}
                  onChange={handleChange}
                  label="Experience Level"
                >
                  {experienceLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Education Requirement</InputLabel>
                <Select
                  name="education"
                  value={job.education}
                  onChange={handleChange}
                  label="Education Requirement"
                >
                  {educationLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={job.status}
                  onChange={handleChange}
                  label="Status"
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Edit Job
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
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
          {renderStepContent(activeStep)}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/hiring-manager/jobs')}
            >
              Cancel
            </Button>
            <Box>
              {activeStep > 0 && (
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
              )}
              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ bgcolor: '#0a66c2', '&:hover': { bgcolor: '#004182' } }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  sx={{ bgcolor: '#0a66c2', '&:hover': { bgcolor: '#004182' } }}
                >
                  {saving ? <CircularProgress size={24} /> : 'Update Job'}
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EditJob; 