import React, { useState } from 'react';
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
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Add as AddIcon, Delete as DeleteIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const steps = ['Basic Information', 'Job Details', 'Requirements & Benefits', 'Salary & Skills'];

const gulfCountries = [
  'United Arab Emirates',
  'Saudi Arabia',
  'Qatar',
  'Kuwait',
  'Oman',
  'Bahrain'
];

const CreateJob = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
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
      currency: 'AED'
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
  const currencies = ['AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'USD', 'EUR', 'GBP'];

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
    } else if (activeStep === 2) {
      if (job.requirements.some(req => !req.trim()) || 
          job.responsibilities.some(resp => !resp.trim())) {
        setError('Please fill in all requirements and responsibilities');
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
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Validate final step
      if (!job.salary.min || !job.salary.max || job.skills.some(skill => !skill.trim())) {
        throw new Error('Please fill in all required fields in Salary & Skills');
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/jobs`,
        job,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Show success toast
      toast.success('Job created successfully! 🎉', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Show success dialog
      setShowSuccessDialog(true);
    } catch (err) {
      console.error('Error creating job:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create job';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleViewJobs = () => {
    setShowSuccessDialog(false);
    navigate('/hiring-manager/jobs');
  };

  const handleCreateAnother = () => {
    setShowSuccessDialog(false);
    setJob({
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
        currency: 'AED'
      },
      benefits: [''],
      skills: [''],
      experience: '',
      education: '',
      status: 'Active'
    });
    setActiveStep(0);
  };

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
              <FormControl fullWidth required>
                <InputLabel>Location</InputLabel>
                <Select
                  name="location"
                  value={job.location}
                  onChange={handleChange}
                  label="Location"
                >
                  {gulfCountries.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
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
      case 3:
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
                      {currencies.map((currency) => (
                        <MenuItem key={currency} value={currency}>
                          {currency}
                        </MenuItem>
                      ))}
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
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
          Create New Job
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
                disabled={loading}
                sx={{ bgcolor: '#0a66c2', '&:hover': { bgcolor: '#004182' } }}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Job'}
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
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
          <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 60, mb: 2 }} />
          <Typography variant="h5" component="div">
            Job Created Successfully!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            Your job posting has been created and is now live on the platform.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            You can view and manage your job posting from the jobs dashboard.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
          <Button
            variant="outlined"
            onClick={handleCreateAnother}
            sx={{ mr: 2 }}
          >
            Create Another Job
          </Button>
          <Button
            variant="contained"
            onClick={handleViewJobs}
            sx={{ bgcolor: '#0a66c2', '&:hover': { bgcolor: '#004182' } }}
          >
            View My Jobs
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateJob; 