
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { registerUser } from '../../services/authService';
import { setUserData, setUserToken } from '../../contexts/authContext';

const SignUp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const validateForm = (data) => {
    const errors = {};
    
    if (!data.name) {
      errors.name = { message: 'Name is required' };
    } else if (data.name.length < 2) {
      errors.name = { message: 'Name must be at least 2 characters' };
    }
    
    if (!data.email) {
      errors.email = { message: 'Email is required' };
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = { message: 'Please enter a valid email address' };
    }
    
    if (!data.password) {
      errors.password = { message: 'Password is required' };
    } else if (data.password.length < 6) {
      errors.password = { message: 'Password must be at least 6 characters' };
    }

    if (!data.confirmPassword) {
      errors.confirmPassword = { message: 'Please confirm your password' };
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = { message: "Passwords don't match" };
    }
    
    return errors;
  };

  const onSubmit = async (data) => {
    const validationErrors = validateForm(data);
    
    if (Object.keys(validationErrors).length > 0) {
      Object.keys(validationErrors).forEach(key => {
        setError(key, validationErrors[key]);
      });
      return;
    }

    try {
      const response = await registerUser(data);

      // If backend sends token in response
      setUserToken(response.data.token);
      setUserData(response.data.user);
      navigate("/dashboard");
    } catch (error) {
      console.log(error)

      // Check for backend validation errors
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        // Set each field error from backend
        Object.keys(errors).forEach((field) => {
          setError(field, { message: errors[field] });
        });
      } else {
        // Display a user-friendly error if credentials are wrong or unknown error
        setError("general", { message: "Something Went Wrong!" });
      }
    }
  };

  const [loading, setLoading] = React.useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-admin-primary/10 to-admin-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Create an account to access the admin panel
          </CardDescription>
          {errors.general?.message && (
            <div className="text-center text-destructive text-sm">
              {errors.general?.message}
            </div>
          )}
        </CardHeader>
        <form
          onSubmit={handleSubmit(async (data) => {
            setLoading(true);
            await onSubmit(data);
            setLoading(false);
          })}
        >
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register('name')}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                {...register('email')}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                {...register('password')}
                disabled={loading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-admin-primary hover:bg-admin-primary-dark"
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link to="/auth/signin" className="text-admin-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;
