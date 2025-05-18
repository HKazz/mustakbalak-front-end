import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Collapse,
  Paper,
} from '@mui/material';
import {
  Work as WorkIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import '../style/JobShowroom.css';
import { toast } from 'react-hot-toast';

const JobShowroom = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    country: '',
    jobType: '',
    industry: '',
    companySize: '',
    experience: '',
    education: '',
    salaryRange: '',
    sortBy: 'newest',
  });
  const [appliedFilters, setAppliedFilters] = useState({
    country: '',
    jobType: '',
    industry: '',
    companySize: '',
    experience: '',
    education: '',
    salaryRange: '',
    sortBy: 'newest',
  });
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [userType, setUserType] = useState(null);

  const industries = [
    'IT',
    'Business',
    'Engineering',
    'Healthcare',
    'Education',
    'Finance',
    'Marketing',
    'Manufacturing',
    'Retail',
    'Other'
  ];

  const companySizes = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+'
  ];

  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Temporary',
    'Internship',
    'Remote'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest to Oldest' },
    { value: 'oldest', label: 'Oldest to Newest' },
    { value: 'salaryHigh', label: 'Salary (High to Low)' },
    { value: 'salaryLow', label: 'Salary (Low to High)' },
    { value: 'companySizeLarge', label: 'Company Size (Large to Small)' },
    { value: 'companySizeSmall', label: 'Company Size (Small to Large)' }
  ];

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
    'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
    'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon',
    'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
    'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
    'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos',
    'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi',
    'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova',
    'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands',
    'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau',
    'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania',
    'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal',
    'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea',
    'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan',
    'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
    'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela',
    'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
  ];

  const experienceLevels = [
    'Entry Level',
    'Mid Level',
    'Senior Level',
    'Executive'
  ];

  const educationLevels = [
    'High School',
    'Bachelor\'s',
    'Master\'s',
    'PhD',
    'Any'
  ];

  const salaryRanges = [
    { label: 'Any', value: '' },
    { label: 'Under 50,000', value: '0-50000' },
    { label: '50,000 - 100,000', value: '50000-100000' },
    { label: '100,000 - 150,000', value: '100000-150000' },
    { label: '150,000 - 200,000', value: '150000-200000' },
    { label: 'Over 200,000', value: '200000-999999' }
  ];

  useEffect(() => {
    fetchJobs();
    // Get user type from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    setUserType(userData?.userType);
    
    // Get applied jobs from localStorage
    const savedAppliedJobs = JSON.parse(localStorage.getItem('appliedJobs')) || [];
    setAppliedJobs(new Set(savedAppliedJobs));
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      console.log('Fetching jobs from:', `${import.meta.env.VITE_BACKEND_URL}/api/jobs`);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/jobs`);
      console.log('Jobs response:', response.data);
      
      if (!Array.isArray(response.data)) {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format from server');
      }
      
      setJobs(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.response?.data?.message || 'Failed to load jobs. Please try again later.');
      setLoading(false);
      setJobs([]);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      country: '',
      jobType: '',
      industry: '',
      companySize: '',
      experience: '',
      education: '',
      salaryRange: '',
      sortBy: 'newest',
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedJob(null);
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const sortJobs = (jobs) => {
    const sortedJobs = [...jobs];
    switch (appliedFilters.sortBy) {
      case 'newest':
        return sortedJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return sortedJobs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'salaryHigh':
        return sortedJobs.sort((a, b) => b.salary.max - a.salary.max);
      case 'salaryLow':
        return sortedJobs.sort((a, b) => a.salary.min - b.salary.min);
      default:
        return sortedJobs;
    }
  };

  const filteredJobs = Array.isArray(jobs) ? jobs.filter(job => {
    // Basic filters
    const matchesCountry = !appliedFilters.country || 
      job.location?.toLowerCase() === appliedFilters.country.toLowerCase();
    
    const matchesJobType = !appliedFilters.jobType || 
      job.type?.toLowerCase() === appliedFilters.jobType.toLowerCase();
    
    const matchesExperience = !appliedFilters.experience || 
      job.experience === appliedFilters.experience;
    
    const matchesEducation = !appliedFilters.education || 
      job.education === appliedFilters.education;

    // Salary range filter
    let matchesSalary = true;
    if (appliedFilters.salaryRange) {
      const [min, max] = appliedFilters.salaryRange.split('-').map(Number);
      const jobMinSalary = job.salary.min;
      const jobMaxSalary = job.salary.max;
      matchesSalary = jobMinSalary >= min && jobMaxSalary <= max;
    }

    return matchesCountry && matchesJobType && matchesExperience && 
           matchesEducation && matchesSalary;
  }) : [];

  const sortedAndFilteredJobs = sortJobs(filteredJobs);

  const handleApply = async (jobId, e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Create the application in the backend
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/applications`,
        { job: jobId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Add job to applied jobs
      const newAppliedJobs = new Set([...appliedJobs, jobId]);
      setAppliedJobs(newAppliedJobs);
      localStorage.setItem('appliedJobs', JSON.stringify([...newAppliedJobs]));

      // Show success message with more details
      toast.success('Your job request has been sent successfully! 🎉', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: '#4caf50',
          color: 'white',
          fontSize: '16px',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }
      });

      // Navigate to the appropriate applications page based on user type
      if (user.userType === 'job_seeker') {
        navigate('/my-applications');
      } else if (user.userType === 'hiring_manager') {
        navigate('/hiring-manager/applications');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application. Please try again.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: '#f44336',
          color: 'white',
          fontSize: '16px',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }
      });
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
    <Container className="job-showroom-container">
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        className="page-title"
        sx={{ 
          color: '#0a66c2 !important',
          fontWeight: 600,
          marginBottom: '2rem',
          textAlign: 'center'
        }}
      >
        Available Jobs
      </Typography>

      {/* Filters Section */}
      <Paper className="filters-section">
        <Box className="filters-header">
          <Typography variant="h6">Filters</Typography>
          <Button
            endIcon={showAdvancedFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={toggleAdvancedFilters}
            className="advanced-filter-button"
          >
            {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
          </Button>
        </Box>

        <Grid container spacing={2} className="basic-filters">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Select Country</InputLabel>
              <Select
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                label="Select Country"
              >
                <MenuItem value="">All Countries</MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Select Job Type</InputLabel>
              <Select
                value={filters.jobType}
                onChange={(e) => handleFilterChange('jobType', e.target.value)}
                label="Select Job Type"
              >
                <MenuItem value="">All Job Types</MenuItem>
                {jobTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                label="Sort By"
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Collapse in={showAdvancedFilters}>
          <Grid container spacing={2} className="advanced-filters">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  value={filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  label="Experience Level"
                >
                  <MenuItem value="">Any Experience</MenuItem>
                  {experienceLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Education Level</InputLabel>
                <Select
                  value={filters.education}
                  onChange={(e) => handleFilterChange('education', e.target.value)}
                  label="Education Level"
                >
                  <MenuItem value="">Any Education</MenuItem>
                  {educationLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Salary Range</InputLabel>
                <Select
                  value={filters.salaryRange}
                  onChange={(e) => handleFilterChange('salaryRange', e.target.value)}
                  label="Salary Range"
                >
                  {salaryRanges.map((range) => (
                    <MenuItem key={range.value} value={range.value}>
                      {range.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box className="filter-actions">
            <Button
              variant="outlined"
              color="primary"
              onClick={handleResetFilters}
              className="reset-button"
            >
              Reset Filters
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplyFilters}
              className="apply-button"
            >
              Apply Filters
            </Button>
          </Box>
        </Collapse>
      </Paper>

      {/* Jobs Grid */}
      <Grid container spacing={3}>
        {sortedAndFilteredJobs.length === 0 ? (
          <Grid item xs={12}>
            <Paper className="no-jobs">
              <DescriptionIcon sx={{ fontSize: 48, color: '#666', mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                No jobs found
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {appliedFilters.country === '' && appliedFilters.jobType === '' && appliedFilters.experience === '' && appliedFilters.education === '' && appliedFilters.salaryRange === '' ? (
                  "There are no jobs available at the moment."
                ) : (
                  `No jobs found with the current filters.`
                )}
              </Typography>
            </Paper>
          </Grid>
        ) : (
          sortedAndFilteredJobs.map((job) => (
            <Grid item xs={12} key={job._id}>
              <Card className="job-card" onClick={() => handleJobClick(job)}>
                <CardContent>
                  <Box className="job-header">
                    <Box className="job-info">
                      <Box className="company-info">
                        <BusinessIcon className="info-icon" />
                        <Typography variant="h6">
                          {job.company}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={job.type}
                      className="job-type-chip"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Job Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        className="job-dialog"
      >
        {selectedJob && (
          <>
            <DialogTitle className="dialog-title">
              <Box className="dialog-header">
                <Typography variant="h5">{selectedJob.title}</Typography>
                <IconButton onClick={handleCloseDialog} className="close-button">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box className="dialog-content">
                <Box className="job-info-section">
                  <Box className="company-info">
                    <BusinessIcon className="dialog-icon" />
                    <Typography variant="h6">{selectedJob.company}</Typography>
                  </Box>
                  <Box className="job-meta">
                    <Chip
                      label={selectedJob.type}
                      className="job-type-chip"
                    />
                    <Box className="meta-item">
                      <LocationIcon className="dialog-icon" />
                      <Typography>{selectedJob.location}</Typography>
                    </Box>
                    <Box className="meta-item">
                      <MoneyIcon className="dialog-icon" />
                      <Typography>
                        {selectedJob.salary.currency} {selectedJob.salary.min.toLocaleString()} - {selectedJob.salary.max.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box className="meta-item">
                      <WorkIcon className="dialog-icon" />
                      <Typography>{selectedJob.experience}</Typography>
                    </Box>
                    <Box className="meta-item">
                      <ScheduleIcon className="dialog-icon" />
                      <Typography>{selectedJob.education}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Divider className="dialog-divider" />
                <Box className="job-description-section">
                  <Typography variant="h6" gutterBottom>Job Description</Typography>
                  <Typography variant="body1" className="description-text">
                    {selectedJob.description}
                  </Typography>
                </Box>
                <Box className="job-requirements-section">
                  <Typography variant="h6" gutterBottom>Requirements</Typography>
                  <ul className="requirements-list">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </Box>
                <Box className="job-responsibilities-section">
                  <Typography variant="h6" gutterBottom>Responsibilities</Typography>
                  <ul className="responsibilities-list">
                    {selectedJob.responsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </Box>
                <Box className="job-skills-section">
                  <Typography variant="h6" gutterBottom>Required Skills</Typography>
                  <Box className="skills-container">
                    {selectedJob.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        className="skill-chip"
                      />
                    ))}
                  </Box>
                </Box>
                {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                  <Box className="job-benefits-section">
                    <Typography variant="h6" gutterBottom>Benefits</Typography>
                    <ul className="benefits-list">
                      {selectedJob.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions className="dialog-actions">
              <Button
                variant="outlined"
                onClick={handleCloseDialog}
                className="close-dialog-button"
              >
                Close
              </Button>
              {userType === 'hiring_manager' ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/jobs/${selectedJob._id}/applications`)}
                  className="view-applications-button"
                >
                  View Applications
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color={appliedJobs.has(selectedJob._id) ? "warning" : "primary"}
                  onClick={(e) => handleApply(selectedJob._id, e)}
                  className={`apply-dialog-button ${appliedJobs.has(selectedJob._id) ? 'requested' : ''}`}
                  startIcon={appliedJobs.has(selectedJob._id) ? <CheckCircleIcon /> : null}
                  disabled={userType === 'hiring_manager'}
                >
                  {appliedJobs.has(selectedJob._id) ? 'Request Sent' : 'Apply Now'}
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default JobShowroom; 