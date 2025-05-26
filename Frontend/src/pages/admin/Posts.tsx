import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Plus, Search, Filter, Edit, Trash2, Calendar as CalendarIcon, List } from 'lucide-react';
import { getAllPosts, deletePost } from '@/services/postsService';
import { toast } from '@/hooks/use-toast';
import PostsSkelton from '@/components/ui/PostsSkelton';
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { enUS } from 'date-fns/locale';
import { format as formatDate } from 'date-fns';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer( {
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
} );

const Posts: React.FC = () =>
{
  const [ searchTerm, setSearchTerm ] = useState( '' );
  const [ statusFilter, setStatusFilter ] = useState( 'all' );
  const [ createdDateFilter, setCreatedDateFilter ] = useState<{
    from?: Date;
    to?: Date;
  }>( {} );
  const [ scheduledDateFilter, setScheduledDateFilter ] = useState<{
    from?: Date;
    to?: Date;
  }>( {} );
  const [ posts, setPosts ] = useState( [] );
  const [ page, setPage ] = useState( 1 );
  const [ hasMore, setHasMore ] = useState( true );
  const [ loading, setLoading ] = useState( false );
  const [ deletePostLoading, setDeletePostLoading ] = useState( false );
  const [ viewMode, setViewMode ] = useState<'list' | 'calendar'>( 'list' );
  const [ filtersOpen, setFiltersOpen ] = useState( false );

  const fetchPosts = async ( pageToLoad = 1, reset = false ) =>
  {
    if ( loading || ( !hasMore && !reset ) ) return;

    setLoading( true );
    try
    {
      const params = new URLSearchParams( {
        page: pageToLoad.toString(),
      } );

      if ( searchTerm ) params.append( 'search', searchTerm );
      if ( statusFilter && statusFilter !== 'all' ) params.append( 'status', statusFilter );

      if ( createdDateFilter.from )
      {
        params.append( 'created_from', formatDate( createdDateFilter.from, 'yyyy-MM-dd' ) );
      }
      if ( createdDateFilter.to )
      {
        params.append( 'created_to', formatDate( createdDateFilter.to, 'yyyy-MM-dd' ) );
      }

      if ( scheduledDateFilter.from )
      {
        params.append( 'scheduled_from', formatDate( scheduledDateFilter.from, 'yyyy-MM-dd' ) );
      }
      if ( scheduledDateFilter.to )
      {
        params.append( 'scheduled_to', formatDate( scheduledDateFilter.to, 'yyyy-MM-dd' ) );
      }

      const response = await getAllPosts( params );
      const newPosts = response.data.data;

      if ( reset )
      {
        setPosts( newPosts );
      } else
      {
        setPosts( prev => [ ...prev, ...newPosts ] );
      }

      setPage( pageToLoad + 1 );
      setHasMore( pageToLoad < response.data.last_page );
    } catch ( error )
    {
      console.error( 'Error fetching posts:', error );
      toast( {
        title: "Error",
        description: "Failed to fetch posts. Please try again.",
        variant: "destructive",
      } );
    } finally
    {
      setLoading( false );
    }
  };

  const getStatusBadge = ( status: string ) =>
  {
    const variants = {
      published: 'bg-green-100 text-green-800',
      scheduled: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800',
    };
    return <Badge className={ variants[ status as keyof typeof variants ] }>{ status }</Badge>;
  };

  const handleDeletePost = async ( postId ) =>
  {
    try
    {
      setDeletePostLoading( true );
      await deletePost( postId );
      toast( {
        title: "Post deleted!",
        description: "Your post has been successfully deleted.",
      } );
      await fetchPosts( 1, true );
    } catch ( error )
    {
      console.error( error );
      toast( {
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      } );
    } finally
    {
      setDeletePostLoading( false );
    }
  };

  const calendarEvents = posts.map( post => ( {
    id: post.id,
    title: post.title,
    start: new Date( post.scheduled_time || post.created_at ),
    end: new Date( new Date( post.scheduled_time || post.created_at ).getTime() + 60 * 60 * 1000 ),
    status: post.status,
    content: post.content,
    platforms: post.platforms,
    image_url: post.image_url,
  } ) );

  const eventStyleGetter = ( event ) =>
  {
    let backgroundColor = '';
    switch ( event.status )
    {
      case 'published':
        backgroundColor = '#4ade80';
        break;
      case 'scheduled':
        backgroundColor = '#60a5fa';
        break;
      case 'draft':
        backgroundColor = '#9ca3af';
        break;
      default:
        backgroundColor = '#3b82f6';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  useEffect( () =>
  {
    fetchPosts();
  }, [] );

  useEffect( () =>
  {
    setPage( 1 );
    setHasMore( true );
    fetchPosts( 1, true );
  }, [ searchTerm, statusFilter, createdDateFilter, scheduledDateFilter ] );

  useEffect( () =>
  {
    const handleScroll = () =>
    {
      if (
        viewMode === 'list' &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        !loading &&
        hasMore
      )
      {
        fetchPosts( page );
      }
    };

    window.addEventListener( 'scroll', handleScroll );
    return () => window.removeEventListener( 'scroll', handleScroll );
  }, [ page, loading, hasMore, viewMode ] );

  const clearDateFilters = () =>
  {
    setCreatedDateFilter( {} );
    setScheduledDateFilter( {} );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
          <p className="text-gray-600">Manage your social media content</p>
        </div>
        <Link to="/posts/create">
          <Button className="bg-admin-primary hover:bg-admin-primary-dark">
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search posts..."
            value={ searchTerm }
            onChange={ ( e ) => setSearchTerm( e.target.value ) }
            className="pl-10"
          />
        </div>

        <Select value={ statusFilter } onValueChange={ setStatusFilter }>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Posts</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>

        <Popover open={ filtersOpen } onOpenChange={ setFiltersOpen }>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Date Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4 space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Created Date</h4>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      { createdDateFilter.from
                        ? formatDate( createdDateFilter.from, 'MMM dd, yyyy' )
                        : 'From' }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={ createdDateFilter.from }
                      onSelect={ ( date ) => setCreatedDateFilter( prev => ( { ...prev, from: date } ) ) }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      { createdDateFilter.to
                        ? formatDate( createdDateFilter.to, 'MMM dd, yyyy' )
                        : 'To' }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={ createdDateFilter.to }
                      onSelect={ ( date ) => setCreatedDateFilter( prev => ( { ...prev, to: date } ) ) }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Scheduled Date</h4>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      { scheduledDateFilter.from
                        ? formatDate( scheduledDateFilter.from, 'MMM dd, yyyy' )
                        : 'From' }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={ scheduledDateFilter.from }
                      onSelect={ ( date ) => setScheduledDateFilter( prev => ( { ...prev, from: date } ) ) }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      { scheduledDateFilter.to
                        ? formatDate( scheduledDateFilter.to, 'MMM dd, yyyy' )
                        : 'To' }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={ scheduledDateFilter.to }
                      onSelect={ ( date ) => setScheduledDateFilter( prev => ( { ...prev, to: date } ) ) }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={ clearDateFilters }
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={ () =>
                {
                  setFiltersOpen( false );
                  fetchPosts( 1, true );
                } }
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex gap-2">
          <Button
            variant={ viewMode === 'list' ? 'default' : 'outline' }
            onClick={ () => setViewMode( 'list' ) }
          >
            <List className="w-4 h-4 mr-2" />
            List
          </Button>
          <Button
            variant={ viewMode === 'calendar' ? 'default' : 'outline' }
            onClick={ () => setViewMode( 'calendar' ) }
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Calendar
          </Button>
        </div>
      </div>

      { viewMode === 'list' ? (
        <>
          <div className="grid md:grid-cols-2 gap-5">
            { posts.map( ( post ) => (
              <Card key={ post.id }>
                <CardHeader>
                  { post.image_url && (
                    <img
                      src={ post.image_url }
                      alt={ post.title }
                      className="w-full h-48 object-cover rounded-md mb-4"
                      loading="lazy"
                    />
                  ) }
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-lg line-clamp-2">{ post.title }</CardTitle>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="outline" size="sm" disabled={ post.status == "published" }>
                          <Link to={ `/posts/edit/${ post.id }` }>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          disabled={ deletePostLoading || post.status == "published" }
                          onClick={ () => handleDeletePost( post.id ) }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      { getStatusBadge( post.status ) }
                      <div className="flex flex-wrap gap-1 overflow-hidden">
                        { post.platforms.map( ( platform ) => (
                          <Badge
                            key={ platform.platform.id }
                            variant="outline"
                            className="text-xs truncate max-w-[80px]"
                          >
                            { platform.platform.name }
                          </Badge>
                        ) ) }
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{ post.content }</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Created: { new Date( post.created_at ).toLocaleDateString() }</span>
                    { post.scheduled_time && (
                      <span>Scheduled: { new Date( post.scheduled_time ).toLocaleString() }</span>
                    ) }
                  </div>
                </CardContent>
              </Card>
            ) ) }
          </div>

          { ( posts.length === 0 && hasMore ) && <PostsSkelton /> }
          { !hasMore && <p className='text-center text-admin-primary-light'>No more posts to load.</p> }

          { loading && (
            <div className="text-center py-4">
              <p className="text-gray-500">Loading more posts...</p>
            </div>
          ) }
        </>
      ) : (
        <div className="h-[800px]">
          <BigCalendar
            localizer={ localizer }
            events={ calendarEvents }
            startAccessor="start"
            endAccessor="end"
            style={ { height: '100%' } }
            eventPropGetter={ eventStyleGetter }
            views={ [ 'month', 'week', 'day', 'agenda' ] }
            defaultView={ Views.MONTH }
            components={ {
              event: ( { event } ) => (
                <div className="p-1">
                  <strong>{ event.title }</strong>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    { event.platforms.map( ( platform ) => (
                      <span key={ platform.platform.id } className="text-xs bg-white text-gray-800 px-1 rounded">
                        { platform.platform.name }
                      </span>
                    ) ) }
                  </div>
                </div>
              ),
            } }
            onSelectEvent={ ( event ) =>
            {
              // You could navigate to edit page or show a modal
              // window.location.href = `/posts/edit/${event.id}`;
            } }
          />
        </div>
      ) }
    </div>
  );
};

export default Posts;