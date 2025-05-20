import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';

const usePageTransition = () => {
  const location = useLocation();
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Minimum loading time of 500ms

    return () => clearTimeout(timer);
  }, [location.pathname, setLoading]);
};

export default usePageTransition; 