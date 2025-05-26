
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import
  {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../../services/authService';
import { clearUserData } from '../../contexts/authContext';
import  Logo  from '@/components/ui/Logo';


const AdminHeader = () =>
{
  const navigate = useNavigate();

  const handleLogout = async () =>
  {
    try
    {
      await logout();
      clearUserData();
      navigate( '/auth/signin' );
    } catch ( error )
    {
      console.error( 'Error fetching user data:', error );
    }
  };

  // Mock user data
  const [ user, setUser ] = React.useState( {} );

  
  



  useEffect(  () =>
  {
    const fetchUser = async () =>
    {
      try
      {
        const response = await getUser();
        console.log( response );
        setUser( response );
      } catch ( error )
      {
        console.log( error.response.status );
        if ( error.response.status === 401 )
        {
          clearUserData();
          navigate( '/auth/signin' );
        } else
        {
          console.error( 'Error fetching user data:', error );
        }
      }
    }
    
    fetchUser()
  }, [] );


  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <h1 className="">
            <Logo/>
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={ user?.avatar } alt={ user?.name } />
                  <AvatarFallback className="bg-admin-primary text-white">
                    { user?.name?.charAt( 0 ).toUpperCase() }
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{ user?.name }</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    { user?.email }
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={ handleLogout }>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
