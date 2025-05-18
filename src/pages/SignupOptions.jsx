import { Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper, Card, CardContent, CardActionArea } from '@mui/material';
import { Work as WorkIcon, Person as PersonIcon, Search as SearchIcon, BusinessCenter as BusinessCenterIcon } from '@mui/icons-material'; 
import '../style/SignupPage.css';

function SignupOptions() {
  return (
    <Container className="signup-container">
      <Paper elevation={3} className="signup-paper type-selection">
        <Typography variant="h4" className="signup-title">
          Choose Account Type
        </Typography>
        <Box className="type-selection-cards">
          <Card className="type-card" component={Link} to="/signup">
            <CardActionArea>
              <CardContent>
                <SearchIcon className="type-icon" />
                <Typography variant="h6">Job Seeker</Typography>
                <Typography variant="body2" color="text.secondary">
                  Looking for job opportunities? Create an account to start your job search.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card className="type-card" component={Link} to="/hiring-manager/signup">
            <CardActionArea>
              <CardContent>
                <BusinessCenterIcon className="type-icon" />
                <Typography variant="h6">Hiring Manager</Typography>
                <Typography variant="body2" color="text.secondary">
                  Need to hire talent? Create an account to post jobs and find candidates.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
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