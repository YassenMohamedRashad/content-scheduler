
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { changePlatformStatus, syncPlatform , getAllPlatforms } from '@/services/platformService';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { Modal, ModalTrigger, ModalContent } from "@/components/ui/Modal"
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PlatformPageSkelton from '@/components/ui/platform-page-skelton';



const Platforms = () =>
{
  const [ platformLoading, setPlatformLoading ] = useState( false );
  const [ updateStatusLoading, setUpdateStatusLoading ] = useState( false );
  const [ syncPlatformLoading, setSyncPlatformLoading ] = useState( false );
  const [analytics , setAnalytics] = useState( {} );


  const [ platforms, setPlatforms ] = useState( [] );


  const fetchPlatforms = async () =>
  {
    setPlatformLoading( true );
    try
    {
      const response = await getAllPlatforms();
      const newPlatforms = response.data.platforms;
      setAnalytics( response.data.analytics );
      
      setPlatforms( [
        ...newPlatforms.filter( ( p ) => p.status === "active" ),
        ...newPlatforms.filter( ( p ) => p.status === "inactive" ),
        ...newPlatforms.filter( ( p ) => p.status !== "active" && p.status !== "inactive" ),
      ] );
      console.log( 'Fetched platforms:', newPlatforms );
    } catch ( error )
    {
      console.error( 'Error fetching platforms:', error );
    } finally
    {
      setPlatformLoading( false );
    }
  };

  const handleTogglePlatform = async ( platformId: string, enabled: boolean ) =>
  {
    try
    {
      setUpdateStatusLoading( true );
      console.log( platformId );
      const response = await changePlatformStatus( platformId, enabled ? 'active' : 'inactive' );

      await fetchPlatforms(); // Refresh the platform list after toggling

      const platform = platforms.find( p => p.id === platformId );
      if ( platform )
      {
        toast( {
          title: `${ platform.name } ${ enabled ? 'enabled' : 'disabled' }`,
          description: enabled
            ? `You can now post to ${ platform.name }`
            : `Posting to ${ platform.name } has been disabled`,
        } );
      }
    } catch ( error )
    {
      console.error( 'Error toggling platform:', error );
      toast( {
        title: 'Error',
        description: 'Failed to update platform status. Please try again.',
        variant: 'destructive',
      } );
      return;
    }finally
    {
      setUpdateStatusLoading( false );
    }

  };


  const connectPlatformSchema = z.object( {
    username: z.string().min( 1, 'username is required' ).max( 100, 'Title must be less than 100 characters' ),
  } );

  useEffect( () =>
  {
    fetchPlatforms();
  }, [] );

  const {
      register,
      handleSubmit,
      watch,
      setValue,
      formState: { isValid , errors },
    } = useForm( {
      resolver: zodResolver( connectPlatformSchema )
    } );
  

  const handleSyncPlatform = async ( platform_id, data ) =>
  {
    try
    {
      setSyncPlatformLoading( true );
      const response = await syncPlatform( platform_id, data.username );
      toast( {
        title: "Success",
        description: `Platform Synced Successfully`,
      } );
      await fetchPlatforms();

    } catch ( error )
    {
      console.log( error.response )
      toast( {
            title: "Error",
        description: error.response.data.errors.username,
            variant: "destructive",
      } );
    } finally
    {
      setSyncPlatformLoading( false );
    }
  }
    

  // Example call:
  // await syncPlatform(platform_id, data.username);


  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platforms</h1>
        <p className="text-gray-600">Manage your social media platform connections and settings</p>
      </div>
      {
        platformLoading && <PlatformPageSkelton />
      }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        { platforms && platforms.map( ( platform ) => (
          <Card key={ platform.id } className="relative pb-20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <CardTitle className="text-2xl">{ platform.name }</CardTitle>
                    <p className="text-sm text-admin-accent-dark">{ platform.pivot.username || '' }</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={ platform.is_synced && platform.pivot.status === "active" }
                    onCheckedChange={ ( checked ) => handleTogglePlatform( platform.id, checked ) }
                    disabled={ !platform.pivot.status || updateStatusLoading }
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <div className="flex gap-2">
                    <Badge
                      variant={ platform.is_synced ? "default" : "secondary" }
                      className={ platform.is_synced ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800" }
                    >
                      { platform.is_synced ? 'Synced' : 'Not Synced' }
                    </Badge>
                    { platform.status == "active" && (
                      <Badge className="bg-admin-primary text-white">
                        Active
                      </Badge>
                    ) }
                  </div>
                </div>

                { platform.is_synced && (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-admin-primary">{ platform.posts_count }</p>
                      <p className="text-xs text-gray-600">Posts</p>
                    </div>
                  </div>
                ) }
              </div>

              {/* Fixed action buttons at the bottom */ }
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                { platform.is_synced ? (
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                ) : (
                  <Modal>
                    <ModalTrigger asChild>
                        <Button className="w-full bg-admin-primary">Connect { platform.name }</Button>
                    </ModalTrigger>

                    <ModalContent>
                        <h2 className="text-xl font-bold mb-2">Sync {platform.name}</h2>
                        <form onSubmit={ handleSubmit( ( data ) => handleSyncPlatform( platform.id, data ) ) }>
                          
                          <Input
                            id="username"
                            placeholder="Enter username"
                            { ...register( 'username' ) }
                            disabled={ platformLoading}
                          />
                          { errors.username && (
                            <p className="text-sm text-destructive mt-2">{ errors.username.message }</p>
                          ) }
                          <Button
                            type="submit"
                            className="mt-4 w-full bg-admin-primary"
                            disabled={ platformLoading }
                          >
                            { platformLoading ? "Connecting .....": "Connect" }
                          </Button>
                        </form>
                    </ModalContent>
                  </Modal>
                ) }
              </div>
            </CardContent>
          </Card>
        
        ) ) }
      </div>

      { analytics.connected_platforms && <Card>
        
        <CardHeader>
          <CardTitle>Platform Usage Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-admin-primary">
                { analytics.connected_platforms }
              </p>
              <p className="text-sm text-gray-600">Connected</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-admin-secondary">
                { analytics.active_platforms }
              </p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-admin-accent">
                { analytics.total_posts }
              </p>
              <p className="text-sm text-gray-600">Total Posts</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">
                { analytics.total_platforms }
              </p>
              <p className="text-sm text-gray-600">Total Platforms</p>
            </div>
          </div>
        </CardContent>
      </Card>}
    </div>
  );
};

export default Platforms;
