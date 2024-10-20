import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useRedirectToHome = () => {
  const location = useLocation();  // Get the current location
  const navigate = useNavigate();  // Hook to programmatically navigate

  useEffect(() => {
    if (location.pathname !== '/') {
      navigate('/');  // Redirect to home if the current path is not "/"
    }
  }, [location, navigate]);
};

export default useRedirectToHome;
