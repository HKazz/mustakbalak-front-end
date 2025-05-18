import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Autocomplete,
  Chip,
  Stack,
  Card,
  CardContent,
  Tooltip,
  Fade,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  ArrowForward as ArrowForwardIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import '../style/SignupPage.css';

// Predefined options
const DEGREE_OPTIONS = [
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'PhD',
  'Associate Degree',
  'High School Diploma',
  'Other'
];

const FIELD_OPTIONS = [
  'Computer Science',
  'Information Technology',
  'Software Engineering',
  'Data Science',
  'Business Administration',
  'Marketing',
  'Finance',
  'Engineering',
  'Medicine',
  'Education',
  'Other'
];

const JOB_TITLES = [
  'Software Developer',
  'Data Scientist',
  'Project Manager',
  'Business Analyst',
  'UI/UX Designer',
  'DevOps Engineer',
  'System Administrator',
  'Network Engineer',
  'Database Administrator',
  'Other'
];

const CERTIFICATE_TYPES = [
  'Professional Certification',
  'Technical Certification',
  'Language Certification',
  'Industry Certification',
  'Academic Certification',
  'Other'
];

const FIELDS_OF_INTEREST = [
  // Technology
  'Software Development',
  'Web Development',
  'Mobile Development',
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'DevOps',
  'Cloud Computing',
  'Artificial Intelligence',
  'Machine Learning',
  'Data Science',
  'Big Data',
  'Cybersecurity',
  'Network Engineering',
  'Database Management',
  'System Administration',
  'Quality Assurance',
  'UI/UX Design',
  'Game Development',
  'Blockchain',
  'IoT Development',
  
  // Business & Management
  'Project Management',
  'Product Management',
  'Business Analysis',
  'Business Intelligence',
  'Digital Marketing',
  'Content Marketing',
  'Social Media Marketing',
  'SEO/SEM',
  'E-commerce',
  'Sales',
  'Customer Success',
  'Human Resources',
  'Finance',
  'Accounting',
  'Consulting',
  
  // Creative & Design
  'Graphic Design',
  'Motion Graphics',
  'Video Production',
  'Photography',
  '3D Modeling',
  'Animation',
  'Architecture',
  'Interior Design',
  'Fashion Design',
  
  // Healthcare & Science
  'Healthcare IT',
  'Medical Research',
  'Biotechnology',
  'Pharmaceuticals',
  'Environmental Science',
  'Data Analysis',
  'Research & Development',
  
  // Education & Training
  'E-learning',
  'Educational Technology',
  'Technical Training',
  'Corporate Training',
  
  // Other
  'Legal Tech',
  'Real Estate Tech',
  'FinTech',
  'EdTech',
  'HealthTech',
  'GreenTech',
  'Other'
];

// Add NATIONALITY_OPTIONS constant
const NATIONALITY_OPTIONS = [
  'Saudi Arabia',
  'United Arab Emirates',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'Oman',
  'Egypt',
  'Jordan',
  'Lebanon',
  'Morocco',
  'Tunisia',
  'Algeria',
  'Other'
];

function CompleteProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Define steps
  const steps = [
    {
      label: 'Personal Information',
      description: 'Your basic personal details',
      icon: <PersonIcon />
    },
    {
      label: 'Education',
      description: 'Your educational background',
      icon: <SchoolIcon />
    },
    {
      label: 'Work Experience',
      description: 'Your professional experience',
      icon: <WorkIcon />
    },
    {
      label: 'Certificates',
      description: 'Your certifications and qualifications',
      icon: <SchoolIcon />
    },
    {
      label: 'Current Position',
      description: 'Your current job role',
      icon: <BusinessIcon />
    },
    {
      label: 'Fields of Interest',
      description: 'Your areas of expertise',
      icon: <WorkIcon />
    }
  ];

  const [formData, setFormData] = useState({
    nationality: '',
    DOB: null,
    certificates: [{
      name: '',
      issuer: '',
      date: null,
      description: '',
      type: ''
    }],
    experience: [{
      title: '',
      company: '',
      startDate: null,
      endDate: null,
      current: false,
      description: ''
    }],
    fields: [],
    currentPosition: '',
    company: '',
    education: [{
      degree: '',
      field: '',
      institution: '',
      graduationDate: null,
      description: ''
    }]
  });

  // Add age validation function
  const isOver18 = (date) => {
    if (!date) return true;
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18;
  };

  // Add date validation for work experience
  const validateEndDate = (startDate, endDate) => {
    if (!startDate || !endDate) return true;
    return new Date(endDate) >= new Date(startDate);
  };

  // Fetch user's current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication error. Please log in again.');
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const userData = response.data.user;
        
        // Set form data with user's current information
        setFormData({
          nationality: userData.nationality || '',
          DOB: userData.DOB ? new Date(userData.DOB) : null,
          certificates: userData.certificates?.length > 0 ? userData.certificates : [{
            name: '',
            issuer: '',
            date: null,
            description: '',
            type: ''
          }],
          experience: userData.experience?.length > 0 ? userData.experience : [{
            title: '',
            company: '',
            startDate: null,
            endDate: null,
            current: false,
            description: ''
          }],
          fields: userData.fields || [],
          currentPosition: userData.currentPosition || '',
          company: userData.company || '',
          education: userData.education?.length > 0 ? userData.education : [{
            degree: '',
            field: '',
            institution: '',
            graduationDate: null,
            description: ''
          }]
        });

        // Store original data for comparison
        setOriginalData(userData);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again.');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e, index, section) => {
    const { name, value, type, checked } = e.target;
    const newFormData = { ...formData };
    
    if (section) {
      newFormData[section][index] = {
        ...newFormData[section][index],
        [name]: type === 'checkbox' ? checked : value
      };
    } else {
      newFormData[name] = value;
    }
    
    setFormData(newFormData);
  };

  const handleDateChange = (date, index, section, field) => {
    const newFormData = { ...formData };
    
    if (field === 'DOB') {
      if (!isOver18(date)) {
        setError('You must be at least 18 years old to register');
        return;
      }
      newFormData[field] = date;
    } else if (section === 'experience' && field === 'endDate') {
      const startDate = newFormData.experience[index].startDate;
      if (!validateEndDate(startDate, date)) {
        setError('End date must be after start date');
        return;
      }
      newFormData[section][index][field] = date;
    } else if (section === 'experience' && field === 'startDate') {
      const endDate = newFormData.experience[index].endDate;
      if (endDate && !validateEndDate(date, endDate)) {
        setError('Start date must be before end date');
        return;
      }
      newFormData[section][index][field] = date;
    } else {
      if (section) {
        newFormData[section][index][field] = date;
      } else {
        newFormData[field] = date;
      }
    }
    
    setError('');
    setFormData(newFormData);
  };

  const handleFieldsChange = (event, newValue) => {
    setFormData(prevData => ({
      ...prevData,
      fields: newValue || []
    }));
  };

  const addItem = (section) => {
    const newFormData = { ...formData };
    const template = {
      certificates: {
        name: '',
        issuer: '',
        date: null,
        description: '',
        type: ''
      },
      experience: {
        title: '',
        company: '',
        startDate: null,
        endDate: null,
        current: false,
        description: ''
      },
      education: {
        degree: '',
        field: '',
        institution: '',
        graduationDate: null,
        description: ''
      }
    };
    
    newFormData[section] = [...newFormData[section], template[section]];
    setFormData(newFormData);
  };

  const removeItem = (section, index) => {
    const newFormData = { ...formData };
    newFormData[section] = newFormData[section].filter((_, i) => i !== index);
    setFormData(newFormData);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setCompletedSteps(prev => [...prev, activeStep]);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Compare formData with originalData to find changed fields
    const changedFields = {};
    Object.keys(formData).forEach(key => {
      if (key === 'DOB') {
        const formDate = formData.DOB ? new Date(formData.DOB).toISOString() : null;
        const originalDate = originalData?.DOB ? new Date(originalData.DOB).toISOString() : null;
        if (formDate !== originalDate) {
          changedFields.DOB = formDate;
        }
      } else if (key === 'certificates' || key === 'experience' || key === 'education') {
        const formArray = JSON.stringify(formData[key]);
        const originalArray = JSON.stringify(originalData?.[key]);
        
        if (formArray !== originalArray) {
          changedFields[key] = formData[key].map(item => {
            const newItem = { ...item };
            if (item.date) newItem.date = new Date(item.date).toISOString();
            if (item.startDate) newItem.startDate = new Date(item.startDate).toISOString();
            if (item.endDate) newItem.endDate = new Date(item.endDate).toISOString();
            if (item.graduationDate) newItem.graduationDate = new Date(item.graduationDate).toISOString();
            return newItem;
          });
        }
      } else if (JSON.stringify(formData[key]) !== JSON.stringify(originalData?.[key])) {
        changedFields[key] = formData[key];
      }
    });

    // Check if any fields were changed
    if (Object.keys(changedFields).length === 0) {
      setError('Please edit at least one field before saving.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/complete-profile`,
        changedFields,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data) {
        setSuccess(true);
        setError('');
        
        // Show success message
        toast.success('Profile updated successfully! Redirecting to your profile...', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Redirect to profile page after a delay
        setTimeout(() => {
          navigate('/profile', { 
            state: { 
              from: 'complete-profile',
              message: 'Profile updated successfully!'
            }
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.details || 'Failed to update profile. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PersonIcon sx={{ color: '#0a66c2', fontSize: 28, mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#0a66c2', fontWeight: 600 }}>
                  Personal Information
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Nationality</InputLabel>
                    <Select
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      label="Nationality"
                    >
                      {NATIONALITY_OPTIONS.map((nationality) => (
                        <MenuItem key={nationality} value={nationality}>{nationality}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date of Birth"
                      value={formData.DOB}
                      onChange={(newValue) => handleDateChange(newValue, null, null, 'DOB')}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          name: "DOB"
                        }
                      }}
                      maxDate={new Date()}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      case 1:
        return (
          <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SchoolIcon sx={{ color: '#0a66c2', fontSize: 28, mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#0a66c2', fontWeight: 600 }}>
                    Education
                  </Typography>
                </Box>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addItem('education')}
                  variant="contained"
                  sx={{ backgroundColor: '#0a66c2' }}
                >
                  Add Education
                </Button>
              </Box>
              {formData.education.map((edu, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    mb: 3, 
                    p: 3, 
                    border: '1px solid #e0e0e0', 
                    borderRadius: 2,
                    backgroundColor: '#fafafa'
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Degree</InputLabel>
                        <Select
                          name="degree"
                          value={edu.degree}
                          onChange={(e) => handleChange(e, index, 'education')}
                          label="Degree"
                        >
                          {DEGREE_OPTIONS.map((degree) => (
                            <MenuItem key={degree} value={degree}>{degree}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Field of Study</InputLabel>
                        <Select
                          name="field"
                          value={edu.field}
                          onChange={(e) => handleChange(e, index, 'education')}
                          label="Field of Study"
                        >
                          {FIELD_OPTIONS.map((field) => (
                            <MenuItem key={field} value={field}>{field}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="institution"
                        label="Institution"
                        value={edu.institution}
                        onChange={(e) => handleChange(e, index, 'education')}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Graduation Date"
                          value={edu.graduationDate}
                          onChange={(date) => handleDateChange(date, index, 'education', 'graduationDate')}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              required: true
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="description"
                        label="Additional Information"
                        value={edu.description}
                        onChange={(e) => handleChange(e, index, 'education')}
                        multiline
                        rows={2}
                      />
                    </Grid>
                  </Grid>
                  {index > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        startIcon={<DeleteIcon />}
                        onClick={() => removeItem('education', index)}
                        color="error"
                        variant="outlined"
                      >
                        Remove
                      </Button>
                    </Box>
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WorkIcon sx={{ color: '#0a66c2', fontSize: 28, mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#0a66c2', fontWeight: 600 }}>
                    Work Experience (Optional)
                  </Typography>
                </Box>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addItem('experience')}
                  variant="contained"
                  sx={{ backgroundColor: '#0a66c2' }}
                >
                  Add Experience
                </Button>
              </Box>
              {formData.experience.map((exp, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    mb: 3, 
                    p: 3, 
                    border: '1px solid #e0e0e0', 
                    borderRadius: 2,
                    backgroundColor: '#fafafa'
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Job Title</InputLabel>
                        <Select
                          name="title"
                          value={exp.title}
                          onChange={(e) => handleChange(e, index, 'experience')}
                          label="Job Title"
                        >
                          {JOB_TITLES.map((title) => (
                            <MenuItem key={title} value={title}>{title}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="company"
                        label="Company"
                        value={exp.company}
                        onChange={(e) => handleChange(e, index, 'experience')}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Start Date"
                          value={exp.startDate}
                          onChange={(date) => handleDateChange(date, index, 'experience', 'startDate')}
                          slotProps={{
                            textField: {
                              fullWidth: true
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="End Date"
                          value={exp.endDate}
                          onChange={(date) => handleDateChange(date, index, 'experience', 'endDate')}
                          disabled={exp.current}
                          minDate={exp.startDate}
                          slotProps={{
                            textField: {
                              fullWidth: true
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="description"
                        label="Job Description"
                        value={exp.description}
                        onChange={(e) => handleChange(e, index, 'experience')}
                        multiline
                        rows={3}
                      />
                    </Grid>
                  </Grid>
                  {index > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        startIcon={<DeleteIcon />}
                        onClick={() => removeItem('experience', index)}
                        color="error"
                        variant="outlined"
                      >
                        Remove
                      </Button>
                    </Box>
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SchoolIcon sx={{ color: '#0a66c2', fontSize: 28, mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#0a66c2', fontWeight: 600 }}>
                    Certificates & Qualifications
                  </Typography>
                </Box>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addItem('certificates')}
                  variant="contained"
                  sx={{ backgroundColor: '#0a66c2' }}
                >
                  Add Certificate
                </Button>
              </Box>
              {formData.certificates.map((cert, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    mb: 3, 
                    p: 3, 
                    border: '1px solid #e0e0e0', 
                    borderRadius: 2,
                    backgroundColor: '#fafafa'
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Certificate Type</InputLabel>
                        <Select
                          name="type"
                          value={cert.type}
                          onChange={(e) => handleChange(e, index, 'certificates')}
                          label="Certificate Type"
                        >
                          {CERTIFICATE_TYPES.map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="name"
                        label="Certificate Name"
                        value={cert.name}
                        onChange={(e) => handleChange(e, index, 'certificates')}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="issuer"
                        label="Issuing Organization"
                        value={cert.issuer}
                        onChange={(e) => handleChange(e, index, 'certificates')}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Date Received"
                          value={cert.date}
                          onChange={(date) => handleDateChange(date, index, 'certificates', 'date')}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              required: true
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="description"
                        label="Description"
                        value={cert.description}
                        onChange={(e) => handleChange(e, index, 'certificates')}
                        multiline
                        rows={2}
                      />
                    </Grid>
                  </Grid>
                  {index > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        startIcon={<DeleteIcon />}
                        onClick={() => removeItem('certificates', index)}
                        color="error"
                        variant="outlined"
                      >
                        Remove
                      </Button>
                    </Box>
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        );
      case 4:
        return (
          <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BusinessIcon sx={{ color: '#0a66c2', fontSize: 28, mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#0a66c2', fontWeight: 600 }}>
                  Current Position (Optional)
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Current Position</InputLabel>
                    <Select
                      name="currentPosition"
                      value={formData.currentPosition}
                      onChange={handleChange}
                      label="Current Position"
                    >
                      {JOB_TITLES.map((title) => (
                        <MenuItem key={title} value={title}>{title}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="company"
                    label="Current Company"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      case 5:
        return (
          <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <WorkIcon sx={{ color: '#0a66c2', fontSize: 28, mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#0a66c2', fontWeight: 600 }}>
                  Fields of Interest (Optional)
                </Typography>
              </Box>
              <Autocomplete
                multiple
                options={FIELDS_OF_INTEREST}
                value={formData.fields}
                onChange={handleFieldsChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Fields of Interest"
                    placeholder="Select or type to add"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={index}
                      label={option}
                      {...getTagProps({ index })}
                      sx={{
                        backgroundColor: '#0a66c2',
                        color: 'white'
                      }}
                    />
                  ))
                }
              />
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  if (user?.userType !== 'job_seeker') {
    console.log('User type:', user?.userType);
    return (
      <Container className="signup-container">
        <Paper elevation={3} className="signup-paper">
          <Typography variant="h5" color="error" align="center">
            This page is only for job seekers
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container className="signup-container" sx={{ py: 4 }}>
      <Toaster position="top-center" />
      <Paper 
        elevation={3} 
        className="signup-paper"
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: '#ffffff',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)'
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            className="signup-title"
            sx={{
              color: '#0a66c2',
              fontWeight: 700,
              mb: 1
            }}
          >
            Complete Your Profile
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Fill in your details to help employers find you
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 1,
              '& .MuiAlert-icon': { color: '#d32f2f' }
            }}
          >
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} className="signup-form">
          <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 4 }}>
            {steps.map((step, index) => (
              <Step key={step.label} completed={completedSteps.includes(index)}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: completedSteps.includes(index) ? '#4caf50' : activeStep >= index ? '#0a66c2' : '#e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                    >
                      {completedSteps.includes(index) ? <CheckCircleIcon /> : step.icon}
                    </Box>
                  )}
                  onClick={() => handleStepClick(index)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: completedSteps.includes(index) ? '#4caf50' : '#0a66c2', 
                      fontWeight: 600 
                    }}
                  >
                    {step.label}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {step.description}
                  </Typography>
                </StepLabel>
                <StepContent>
                  {renderStepContent(index)}
                  <Box sx={{ mb: 2, mt: 2 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ 
                          mr: 1,
                          backgroundColor: '#0a66c2',
                          '&:hover': {
                            backgroundColor: '#004182'
                          }
                        }}
                      >
                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          <Box 
            className="form-actions" 
            sx={{ 
              mt: 4,
              position: 'sticky',
              bottom: 0,
              backgroundColor: 'white',
              pt: 2,
              pb: 2,
              borderTop: '1px solid #e0e0e0',
              zIndex: 1000
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  className="signup-button"
                  disabled={loading}
                  fullWidth
                  size="large"
                  endIcon={!loading && <ArrowForwardIcon />}
                  sx={{
                    backgroundColor: '#0a66c2',
                    '&:hover': {
                      backgroundColor: '#004182'
                    },
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Profile'}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    OR
                  </Typography>
                </Divider>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                  fullWidth
                  size="large"
                  sx={{
                    borderColor: '#0a66c2',
                    color: '#0a66c2',
                    '&:hover': {
                      borderColor: '#004182',
                      backgroundColor: 'rgba(10, 102, 194, 0.08)'
                    },
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600
                  }}
                >
                  Skip for now
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default CompleteProfile; 