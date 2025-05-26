import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Clock, User, FileText, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getAllActivities } from '@/services/analyticsService';
import { Skeleton } from '@/components/ui/skeleton';

const ActivityLog: React.FC = () =>
{
  const [ searchTerm, setSearchTerm ] = useState( '' );
  const [ typeFilter, setTypeFilter ] = useState( 'all' );
  const [ activities, setActivities ] = useState( [] );
  const [ page, setPage ] = useState( 1 );
  const [ hasMore, setHasMore ] = useState( true );
  const [ loading, setLoading ] = useState( false );
  const [ initialLoad, setInitialLoad ] = useState( true );

  const fetchActivities = async ( pageToLoad = 1, reset = false ) =>
  {
    if ( loading || ( !hasMore && !reset ) ) return;

    setLoading( true );
    try
    {
      const response = await getAllActivities( pageToLoad, searchTerm, typeFilter );
      const newActivities = response.data.data;

      if ( reset )
      {
        setActivities( newActivities );
      } else
      {
        setActivities( prev => [ ...prev, ...newActivities ] );
      }

      setPage( pageToLoad + 1 );
      setHasMore( pageToLoad < response.data.last_page );
    } catch ( error )
    {
      toast( {
        title: "Error",
        description: "Failed to fetch activity logs. Please try again.",
        variant: "destructive",
      } );
    } finally
    {
      setLoading( false );
      if ( initialLoad ) setInitialLoad( false );
    }
  };

  const getActivityIcon = ( type: string ) =>
  {
    switch ( type )
    {
      case 'post':
        return <FileText className="w-4 h-4" />;
      case 'platform':
        return <Settings className="w-4 h-4" />;
      case 'profile':
        return <User className="w-4 h-4" />;
      case 'system':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityBadge = ( action: string ) =>
  {
    const badgeColors = {
      'Post Published': 'bg-green-100 text-green-800',
      'Post Scheduled': 'bg-blue-100 text-blue-800',
      'Post Failed': 'bg-red-100 text-red-800',
      'Post Deleted': 'bg-gray-100 text-gray-800',
      'Platform Connected': 'bg-green-100 text-green-800',
      'Platform Enabled': 'bg-green-100 text-green-800',
      'Platform Disabled': 'bg-yellow-100 text-yellow-800',
      'Profile Updated': 'bg-blue-100 text-blue-800',
      'Login': 'bg-gray-100 text-gray-800',
    };

    return (
      <Badge className={ badgeColors[ action as keyof typeof badgeColors ] || 'bg-gray-100 text-gray-800' }>
        { action }
      </Badge>
    );
  };

  const formatTimestamp = ( timestamp: string ) =>
  {
    const date = new Date( timestamp );
    if ( isNaN( date.getTime() ) ) return 'Invalid date';
    return date.toLocaleString();
  };

  useEffect( () =>
  {
    fetchActivities(); // Loads page 1
  }, [] );

  useEffect( () =>
  {
    setPage( 1 );
    setHasMore( true );
    fetchActivities( 1, true ); // reset = true
  }, [ searchTerm, typeFilter ] );

  useEffect( () =>
  {
    const handleScroll = () =>
    {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        !loading &&
        hasMore
      )
      {
        fetchActivities( page );
      }
    };

    window.addEventListener( 'scroll', handleScroll );
    return () => window.removeEventListener( 'scroll', handleScroll );
  }, [ page, loading, hasMore ] );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
        <p className="text-gray-600">Track all your account activities and system events</p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search activities..."
            value={ searchTerm }
            onChange={ ( e ) => setSearchTerm( e.target.value ) }
            className="pl-10"
          />
        </div>
        <Select value={ typeFilter } onValueChange={ setTypeFilter }>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="post">Posts</SelectItem>
            <SelectItem value="platform">Platforms</SelectItem>
            <SelectItem value="profile">Profile</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            { activities.map( ( activity ) => (
              <div key={ activity.id } className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 bg-admin-primary/10 rounded-full flex items-center justify-center text-admin-primary">
                  { getActivityIcon( activity.type ) }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      { getActivityBadge( activity.action ) }
                      <span className="text-sm text-gray-500">
                        { formatTimestamp( activity.created_at ) }
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    { activity.description }
                  </p>
                </div>
              </div>
            ) ) }

            { initialLoad && (
              <div className="space-y-4">
                { [ ...Array( 5 ) ].map( ( _, i ) => (
                  <div key={ i } className="flex items-start space-x-4 p-4 border rounded-lg">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[250px]" />
                    </div>
                  </div>
                ) ) }
              </div>
            ) }

            { !initialLoad && activities.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No activities found</p>
              </div>
            ) }
          </div>

          { loading && activities.length > 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500">Loading more activities...</p>
            </div>
          ) }

          { !hasMore && activities.length > 0 && (
            <p className="text-center text-admin-primary-light py-4">No more activities.</p>
          ) }
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLog;