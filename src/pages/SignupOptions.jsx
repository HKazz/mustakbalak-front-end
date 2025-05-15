import { Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { Work as WorkIcon, Person as PersonIcon } from '@mui/icons-material';

function SignupOptions() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Typography 
          component="h1" 
          variant="h4" 
          sx={{ 
            mb: 4, 
            color: '#0a66c2',
            fontWeight: 600,
            textAlign: 'center'
          }}
        >
          Choose Your Account Type
        </Typography>

        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            size="large"
            startIcon={<PersonIcon />}
            sx={{
              py: 2,
              backgroundColor: '#0a66c2',
              '&:hover': {
                backgroundColor: '#004182',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Sign up as Job Seeker
          </Button>

          <Button
            component={Link}
            to="/hiring-manager/signup"
            variant="contained"
            size="large"
            startIcon={<WorkIcon />}
            sx={{
              py: 2,
              backgroundColor: '#0a66c2',
              '&:hover': {
                backgroundColor: '#004182',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Sign up as Hiring Manager
          </Button>
        </Box>

        <Typography 
          variant="body2" 
          sx={{ 
            mt: 3, 
            color: '#666',
            textAlign: 'center'
          }}
        >
          Already have an account?{' '}
          <Link 
            to="/login-options" 
            style={{ 
              color: '#0a66c2',
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default SignupOptions; 