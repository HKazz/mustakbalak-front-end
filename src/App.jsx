import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HiringManagerLogin from './pages/HiringManagerLogin';
import HiringManagerSignup from './pages/HiringManagerSignup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CompleteProfile from './pages/CompleteProfile';
import HiringManagerCompleteProfile from './pages/HiringManagerCompleteProfile';
import HiringManagerProfile from './pages/HiringManagerProfile';
import JobsList from './pages/JobsList';
import CreateJob from './pages/CreateJob';
import EditJob from './pages/EditJob';
import JobShowroom from './pages/JobShowroom';
import UserApplications from './pages/UserApplications';
import ProtectedRoute from './components/ProtectedRoute';
import LoginOptions from './pages/LoginOptions';
import SignupOptions from './pages/SignupOptions';
import HiringManagerApplications from './pages/HiringManagerApplications';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0a66c2',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0a66c2 !important',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <ErrorBoundary>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login-options" element={<LoginOptions />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signup-options" element={<SignupOptions />} />
                <Route path="/hiring-manager/login" element={<HiringManagerLogin />} />
                <Route path="/hiring-manager/signup" element={<HiringManagerSignup />} />
                
                {/* Protected Routes - Only for authenticated users */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/complete-profile" element={
                  <ProtectedRoute>
                    <CompleteProfile />
                  </ProtectedRoute>
                } />
                <Route path="/job-seeker/profile" element={
                  <ProtectedRoute requiredUserType="job_seeker">
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/job-seeker/complete-profile" element={
                  <ProtectedRoute requiredUserType="job_seeker">
                    <CompleteProfile />
                  </ProtectedRoute>
                } />
                <Route path="/hiring-manager/profile" element={
                  <ProtectedRoute requiredUserType="hiring_manager">
                    <HiringManagerProfile />
                  </ProtectedRoute>
                } />
                <Route path="/hiring-manager/complete-profile" element={
                  <ProtectedRoute requiredUserType="hiring_manager">
                    <HiringManagerCompleteProfile />
                  </ProtectedRoute>
                } />

                {/* Job Management Routes - Only for hiring managers */}
                <Route path="/hiring-manager/jobs" element={
                  <ProtectedRoute requiredUserType="hiring_manager">
                    <JobsList />
                  </ProtectedRoute>
                } />
                <Route path="/hiring-manager/jobs/create" element={
                  <ProtectedRoute requiredUserType="hiring_manager">
                    <CreateJob />
                  </ProtectedRoute>
                } />
                <Route path="/hiring-manager/jobs/edit/:jobId" element={
                  <ProtectedRoute requiredUserType="hiring_manager">
                    <EditJob />
                  </ProtectedRoute>
                } />

                {/* Public Job Showroom */}
                <Route
                  path="/job-showroom"
                  element={
                    <ProtectedRoute>
                      <JobShowroom />
                    </ProtectedRoute>
                  }
                />

                {/* User Applications */}
                <Route
                  path="/my-applications"
                  element={
                    <ProtectedRoute>
                      <UserApplications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-applications/:id"
                  element={
                    <ProtectedRoute>
                      <UserApplications />
                    </ProtectedRoute>
                  }
                />

                {/* Hiring Manager Applications */}
                <Route
                  path="/hiring-manager/applications"
                  element={
                    <ProtectedRoute requiredUserType="hiring_manager">
                      <HiringManagerApplications />
                    </ProtectedRoute>
                  }
                />

                {/* Catch all route - redirect to dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </ErrorBoundary>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
