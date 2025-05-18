import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Divider,
  Chip,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Work as WorkIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  BusinessCenter as BusinessCenterIcon,
  Search as SearchIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import '../style/Navbar.css';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [jobsMenuAnchorEl, setJobsMenuAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleJobsMenuOpen = (event) => {
    setJobsMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setJobsMenuAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const isProfileMenuOpen = Boolean(anchorEl);
  const isJobsMenuOpen = Boolean(jobsMenuAnchorEl);
  const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);

  const getUserInitial = () => {
    if (user?.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    }
    return '?';
  };

  const handleProfile = () => {
    if (user.userType === 'hiring_manager') {
      navigate('/hiring-manager/profile');
    } else if (user.userType === 'job_seeker') {
      navigate('/job-seeker/profile');
    }
    handleMenuClose();
  };

  const handleCompleteProfile = () => {
    if (user.userType === 'hiring_manager') {
      navigate('/hiring-manager/complete-profile');
    } else if (user.userType === 'job_seeker') {
      navigate('/job-seeker/complete-profile');
    }
    handleMenuClose();
  };

  return (
    <AppBar position="fixed" className={`navbar ${visible ? '' : 'hidden'}`}>
      <Toolbar className="navbar-container" style={{ justifyContent: 'space-between' }}>
        {/* Left: Logo and Brand */}
        <Box className="navbar-brand" sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <WorkIcon sx={{ color: '#fff', fontSize: 28 }} />
          <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h6">Mustakbalak</Typography>
          </Link>
        </Box>

        {/* Right: All other items */}
        <Box className="navbar-right">
          {user ? (
            <>
              <Box className="navbar-welcome">
                <span className="navbar-welcome-label">Welcome</span>
                <span className="navbar-username">{user?.fullName || 'User'}</span>
                <Chip
                  label={user.userType === 'hiring_manager' ? 'Hiring Manager' : 'Job Seeker'}
                  size="small"
                  className="navbar-role-chip"
                />
              </Box>

              {/* Browse Jobs Link */}
              <Button
                component={Link}
                to="/job-showroom"
                color="inherit"
                className="navbar-button"
                startIcon={<SearchIcon />}
                sx={{
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Browse Jobs
              </Button>

              {/* My Applications Link - Only for Job Seekers */}
              {user?.userType === 'job_seeker' && (
                <Button
                  component={Link}
                  to="/my-applications"
                  color="inherit"
                  className="navbar-button"
                  startIcon={<DescriptionIcon />}
                  sx={{
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  My Applications
                </Button>
              )}

              {/* Jobs Management - Only for Hiring Managers */}
              {user?.userType === 'hiring_manager' && (
                <>
                  <Button
                    color="inherit"
                    className="navbar-button"
                    startIcon={<WorkIcon />}
                    onClick={handleJobsMenuOpen}
                    sx={{
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Jobs
                  </Button>
                  <Menu
                    anchorEl={jobsMenuAnchorEl}
                    open={isJobsMenuOpen}
                    onClose={handleMenuClose}
                    className="navbar-menu"
                  >
                    <MenuItem
                      component={Link}
                      to="/hiring-manager/jobs/create"
                      onClick={handleMenuClose}
                      className="navbar-menu-item"
                    >
                      <AddIcon sx={{ mr: 1, fontSize: 20 }} />
                      Create Job
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/hiring-manager/jobs"
                      onClick={handleMenuClose}
                      className="navbar-menu-item"
                    >
                      <SearchIcon sx={{ mr: 1, fontSize: 20 }} />
                      View Jobs
                    </MenuItem>
                  </Menu>

                  {/* Applications Link */}
                  <Button
                    component={Link}
                    to="/hiring-manager/applications"
                    color="inherit"
                    className="navbar-button"
                    startIcon={<DescriptionIcon />}
                    sx={{
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Applications
                  </Button>
                </>
              )}

              <IconButton
                color="inherit"
                onClick={handleProfileMenuOpen}
                className="navbar-icon-button"
              >
                <Avatar className="navbar-avatar">
                  {getUserInitial()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={isProfileMenuOpen}
                onClose={handleMenuClose}
                className="navbar-menu"
              >
                <Box className="navbar-menu-header">
                  <Typography variant="subtitle2">{user?.fullName || 'User'}</Typography>
                  <Typography variant="body2">{user.email || ''}</Typography>
                  <Chip
                    label={user.userType === 'hiring_manager' ? 'Hiring Manager' : 'Job Seeker'}
                    size="small"
                    className="navbar-menu-chip"
                  />
                </Box>
                <Divider />
                <MenuItem
                  onClick={handleProfile}
                  className="navbar-menu-item"
                >
                  <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                  View Profile
                </MenuItem>
                <MenuItem
                  onClick={handleCompleteProfile}
                  className="navbar-menu-item"
                >
                  <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                  Edit Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} className="navbar-menu-item">
                  <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                  Logout
                </MenuItem>
              </Menu>

              <IconButton
                color="inherit"
                onClick={handleMobileMenuOpen}
                className="navbar-icon-button"
                sx={{ display: { xs: 'flex', md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={mobileMenuAnchorEl}
                open={isMobileMenuOpen}
                onClose={handleMenuClose}
                className="navbar-menu"
              >
                <MenuItem
                  onClick={handleProfile}
                  className="navbar-menu-item"
                >
                  <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                  View Profile
                </MenuItem>
                <MenuItem
                  onClick={handleCompleteProfile}
                  className="navbar-menu-item"
                >
                  <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                  Edit Profile
                </MenuItem>
                {user.userType === 'hiring_manager' ? (
                  <>
                    <MenuItem
                      component={Link}
                      to="/hiring-manager/jobs/create"
                      onClick={handleMenuClose}
                      className="navbar-menu-item"
                    >
                      <AddIcon sx={{ mr: 1, fontSize: 20 }} />
                      Create Job
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/hiring-manager/jobs"
                      onClick={handleMenuClose}
                      className="navbar-menu-item"
                    >
                      <SearchIcon sx={{ mr: 1, fontSize: 20 }} />
                      View Jobs
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem
                    component={Link}
                    to="/my-applications"
                    onClick={handleMenuClose}
                    className="navbar-menu-item"
                  >
                    <DescriptionIcon sx={{ mr: 1, fontSize: 20 }} />
                    My Applications
                  </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleLogout} className="navbar-menu-item">
                  <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                color="inherit"
                variant="outlined"
                className="navbar-button navbar-button-outlined"
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                color="inherit"
                variant="outlined"
                className="navbar-button navbar-button-outlined"
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
