// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { checkUserAuth } from '@/contexts/authContext';


const ProtectedRoute = ( { children } ) =>
{
   // or check localStorage/session

  if ( !checkUserAuth() )
  {
    return <Navigate to="/auth/signin" />;
  }

  return children;
};

export default ProtectedRoute;
