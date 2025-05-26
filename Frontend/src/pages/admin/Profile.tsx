import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getUser, updateProfile } from '../../services/authService';

const profileSchema = z
  .object( {
    name: z.string().min( 2, 'Name must be at least 2 characters' ),
    email: z.string().email( 'Please enter a valid email address' ),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  } )
  .refine( ( data ) =>
  {
    if ( data.newPassword && data.newPassword !== data.confirmPassword )
    {
      return false;
    }
    return true;
  }, {
    message: "Passwords don't match",
    path: [ 'confirmPassword' ],
  } );

const Profile = () =>
{
  const [ loading, setLoading ] = useState( false );
  const [ avatarFallback, setAvatarFallback ] = useState( '' );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm( {
    resolver: zodResolver( profileSchema ),
    defaultValues: {
      name: '',
      email: '',
    },
  } );

  // Update avatar fallback if name changes
  const watchedName = watch( 'name' );
  useEffect( () =>
  {
    if ( watchedName )
    {
      setAvatarFallback( watchedName.charAt( 0 ).toUpperCase() );
    }
  }, [ watchedName ] );

  useEffect( () =>
  {
    const fetchUserData = async () =>
    {
      try
      {
        setLoading( true );
        const userData = await getUser();
        reset( {
          name: userData.name || '',
          email: userData.email || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        } );
        if ( userData.name )
        {
          setAvatarFallback( userData.name.split(" ")[0][0] + userData.name.split(" ")[1][0]);
        }
      } catch ( error )
      {
        console.error( 'Error fetching user data:', error );
      } finally
      {
        setLoading( false );
      }
    };

    fetchUserData();
  }, [ reset ] );

  const onSubmit = async ( data ) =>
  {
    try
    {
      setLoading( true );
      const response = await updateProfile( data );
      toast( {
        title: 'Profile updated!',
        description: 'Your profile information has been successfully updated.',
      } );
    } catch ( error )
    {
      console.error( 'Error updating profile:', error );
      toast( {
        title: 'Error',
        description: error?.response?.data?.message
          ? error.response.data.message
          : 'There was an error updating your profile.',
        variant: 'destructive',
      } );
    } finally
    {
      setLoading( false );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={ handleSubmit( onSubmit ) } className="space-y-6">
                <div className="flex justify-center mb-6">
                  <Avatar className="w-40 h-40">
                    <AvatarImage src="" alt="Profile" />
                    <AvatarFallback className="font-extrabold text-3xl">{ avatarFallback }</AvatarFallback>
                  </Avatar>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" { ...register( 'name' ) } disabled={ loading } />
                    { errors.name && (
                      <p className="text-sm text-destructive">{ errors.name.message }</p>
                    ) }
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" { ...register( 'email' ) } disabled={ loading } />
                    { errors.email && (
                      <p className="text-sm text-destructive">{ errors.email.message }</p>
                    ) }
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Change Password
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Enter current password"
                      disabled={ loading }
                      { ...register( 'currentPassword' ) }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        disabled={ loading }
                        { ...register( 'newPassword' ) }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        disabled={ loading }
                        { ...register( 'confirmPassword' ) }
                      />
                      { errors.confirmPassword && (
                        <p className="text-sm text-destructive">{ errors.confirmPassword.message }</p>
                      ) }
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-admin-primary hover:bg-admin-primary-dark"
                    disabled={ loading }
                  >
                    { loading ? 'Saving ...' : 'Save Changes' }
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
