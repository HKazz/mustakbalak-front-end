import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  LinearProgress,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardActionArea,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Error
} from '@mui/icons-material';
import '../style/SignupPage.css';

function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    userType: '',
    username: '',
    email: '',
    phone: '',
    countryCode: '+20',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    dateOfBirth: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordStrengthLevel, setPasswordStrengthLevel] = useState(0);
  const [passwordStrengthText, setPasswordStrengthText] = useState('');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validatePassword = (password) => {
    let strength = 0;
    let level = 0;
    let text = '';

    if (password.length >= 8) {
      strength += 25;
      level += 1;
    }
    if (/[A-Z]/.test(password)) {
      strength += 25;
      level += 1;
    }
    if (/[0-9]/.test(password)) {
      strength += 25;
      level += 1;
    }
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 25;
      level += 1;
    }

    setPasswordStrength(strength);
    setPasswordStrengthLevel(level);

    switch (level) {
      case 0:
        text = 'Very Weak';
        break;
      case 1:
        text = 'Weak';
        break;
      case 2:
        text = 'Medium';
        break;
      case 3:
        text = 'Strong';
        break;
      case 4:
        text = 'Very Strong';
        break;
      default:
        text = '';
    }
    setPasswordStrengthText(text);
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (confirmPassword !== formData.password) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords do not match'
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        confirmPassword: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... rest of submit logic
  };

  return (
    <div className="signup-container">
      <Paper className="signup-paper">
        {!formData.userType ? (
          <div className="type-selection">
            <Typography variant="h4" className="signup-title">
              Join Mustakbalak
            </Typography>
            <div className="type-selection-cards">
              <Card 
                className="type-card"
                onClick={() => setFormData({ ...formData, userType: 'job_seeker' })}
              >
                <CardActionArea>
                  <CardContent>
                    <PersonIcon className="type-icon" />
                    <Typography variant="h6">Job Seeker</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Find your dream job and advance your career
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Card 
                className="type-card"
                onClick={() => setFormData({ ...formData, userType: 'company' })}
              >
                <CardActionArea>
                  <CardContent>
                    <BusinessIcon className="type-icon" />
                    <Typography variant="h6">Company</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Post jobs and find the best talent
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="signup-form">
            <Typography variant="h4" className="signup-title">
              Create your account
            </Typography>

            <div className="password-field-container">
              <TextField
                required
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  validatePassword(e.target.value);
                }}
                error={!!errors.password}
                helperText={errors.password}
                className="form-field"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <div className="password-strength">
                <LinearProgress 
                  variant="determinate" 
                  value={passwordStrength} 
                  className={`strength-${passwordStrengthLevel}`}
                />
                <span className="strength-text">
                  {passwordStrengthText}
                </span>
              </div>
            </div>

            <div className="password-field-container">
              <TextField
                required
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  validateConfirmPassword(e.target.value);
                }}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                className="form-field"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {formData.password && formData.confirmPassword && (
                <div className="password-match-indicator">
                  {formData.password === formData.confirmPassword ? (
                    <span className="match-success">
                      <CheckCircle fontSize="small" />
                      Passwords match
                    </span>
                  ) : (
                    <span className="match-error">
                      <Error fontSize="small" />
                      Passwords do not match
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="form-actions">
              <Button
                type="button"
                variant="outlined"
                onClick={() => setFormData({ ...formData, userType: '' })}
                className="back-button"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                className="signup-button"
              >
                Sign Up
              </Button>
            </div>
          </form>
        )}
      </Paper>
    </div>
  );
}

export default SignupPage; 