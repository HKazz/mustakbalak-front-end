import { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import '../style/Dashboard.css';

/**
 * Dashboard Component
 * 
 * This component displays key statistics and goals for the Mustakbalak platform.
 * It shows current numbers (2024) and target goals (2026) with animated counters
 * and progress bars.
 */
function Dashboard() {
  // State for storing the final statistics (2026 goals)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalJobs: 0,
    activeApplications: 0
  });

  // State for animated numbers that count up from 0
  const [animatedStats, setAnimatedStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalJobs: 0,
    activeApplications: 0
  });

  // Target numbers for 2026
  const finalStats = {
    totalUsers: 50000,
    totalCompanies: 1000,
    totalJobs: 5000,
    activeApplications: 15000
  };

  // Current numbers for 2025
  const currentStats = {
    totalUsers: 15000,
    totalCompanies: 300,
    totalJobs: 1500,
    activeApplications: 4500
  };

  // Effect to animate numbers from 0 to their target values
  useEffect(() => {
    const duration = 2000; // Animation duration in milliseconds
    const steps = 60; // Number of steps for smooth animation
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      
      // Calculate intermediate values for smooth animation
      setAnimatedStats({
        totalUsers: Math.floor((finalStats.totalUsers * currentStep) / steps),
        totalCompanies: Math.floor((finalStats.totalCompanies * currentStep) / steps),
        totalJobs: Math.floor((finalStats.totalJobs * currentStep) / steps),
        activeApplications: Math.floor((finalStats.activeApplications * currentStep) / steps)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  // Helper function to calculate progress percentage
  const calculateProgress = (current, target) => {
    return (current / target) * 100;
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header Section */}
        <Box className="dashboard-header">
          <Typography variant="h3" className="dashboard-title">
            Mustakbalak Statistics
          </Typography>
          <Typography variant="h6" className="dashboard-subtitle">
            Goals in 2026
          </Typography>
        </Box>

        {/* Statistics Grid */}
        <Grid container spacing={4} justifyContent="center" className="stats-grid">
          {/* Total Users Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card className="dashboard-card">
              <CardContent className="stat-card-content">
                <Box className="stat-icon-container">
                  <PeopleIcon className="stat-icon" />
                </Box>
                <Typography variant="h6" className="stat-title">
                  Total Users
                </Typography>
                <Typography variant="h3" className="stat-number">
                  {animatedStats.totalUsers.toLocaleString()}
                </Typography>
                <Typography variant="body2" className="stat-description">
                  Registered job seekers
                </Typography>
                {/* Progress Section */}
                <Box className="progress-container">
                  <Typography variant="caption" className="progress-label">
                    2025: {currentStats.totalUsers.toLocaleString()}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={calculateProgress(currentStats.totalUsers, finalStats.totalUsers)}
                    className="progress-bar"
                  />
                  <Typography variant="caption" className="progress-label">
                    2026 Goal: {finalStats.totalUsers.toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Total Companies Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card className="dashboard-card">
              <CardContent className="stat-card-content">
                <Box className="stat-icon-container">
                  <BusinessIcon className="stat-icon" />
                </Box>
                <Typography variant="h6" className="stat-title">
                  Total Companies
                </Typography>
                <Typography variant="h3" className="stat-number">
                  {animatedStats.totalCompanies.toLocaleString()}
                </Typography>
                <Typography variant="body2" className="stat-description">
                  Registered companies
                </Typography>
                {/* Progress Section */}
                <Box className="progress-container">
                  <Typography variant="caption" className="progress-label">
                    2025: {currentStats.totalCompanies.toLocaleString()}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={calculateProgress(currentStats.totalCompanies, finalStats.totalCompanies)}
                    className="progress-bar"
                  />
                  <Typography variant="caption" className="progress-label">
                    2026 Goal: {finalStats.totalCompanies.toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Jobs Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card className="dashboard-card">
              <CardContent className="stat-card-content">
                <Box className="stat-icon-container">
                  <WorkIcon className="stat-icon" />
                </Box>
                <Typography variant="h6" className="stat-title">
                  Total Jobs
                </Typography>
                <Typography variant="h3" className="stat-number">
                  {animatedStats.totalJobs.toLocaleString()}
                </Typography>
                <Typography variant="body2" className="stat-description">
                  Active job listings
                </Typography>
                {/* Progress Section */}
                <Box className="progress-container">
                  <Typography variant="caption" className="progress-label">
                    2025: {currentStats.totalJobs.toLocaleString()}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={calculateProgress(currentStats.totalJobs, finalStats.totalJobs)}
                    className="progress-bar"
                  />
                  <Typography variant="caption" className="progress-label">
                    2026 Goal: {finalStats.totalJobs.toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Active Applications Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card className="dashboard-card">
              <CardContent className="stat-card-content">
                <Box className="stat-icon-container">
                  <AssignmentIcon className="stat-icon" />
                </Box>
                <Typography variant="h6" className="stat-title">
                  Active Applications
                </Typography>
                <Typography variant="h3" className="stat-number">
                  {animatedStats.activeApplications.toLocaleString()}
                </Typography>
                <Typography variant="body2" className="stat-description">
                  Current applications
                </Typography>
                {/* Progress Section */}
                <Box className="progress-container">
                  <Typography variant="caption" className="progress-label">
                    2025: {currentStats.activeApplications.toLocaleString()}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={calculateProgress(currentStats.activeApplications, finalStats.activeApplications)}
                    className="progress-bar"
                  />
                  <Typography variant="caption" className="progress-label">
                    2026 Goal: {finalStats.activeApplications.toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Dashboard; 