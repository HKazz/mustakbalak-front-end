import React from 'react';
import { Backdrop, CircularProgress, Box, Typography } from '@mui/material';
import { useLoading } from '../context/LoadingContext';

const LoadingSpinner = () => {
  const { loading } = useLoading();

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
      open={loading}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CircularProgress color="primary" size={60} thickness={4} />
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 500 }}>
          Loading...
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default LoadingSpinner; 