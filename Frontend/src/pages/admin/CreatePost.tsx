import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Upload, Calendar, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getAllPlatforms } from '@/services/platformService';// Adjust the import path as needed
import { createPost } from '@/services/postsService';// Adjust the import path as needed
import { Badge } from '@/components/ui/badge';
import PlatformsSkelton from '@/components/ui/PlatformsSkelton';






const CreatePost: React.FC = () =>
{
  const [ maxCharLimit, setMaxCharLimit ] = useState( 280 );
  const createPostSchema = z.object( {
    title: z.string().min( 1, 'Title is required' ).max( 100, 'Title must be less than 100 characters' ),
    content: z.string().min( 1, 'Content is required' ).max( 280, 'Content must be less than 280 characters' ),
    platforms: z.array( z.number() ).min( 1, 'Select at least one platform' ),
    scheduledDate: z.string().optional(),
    scheduledTime: z.string().optional(),
    image: z.instanceof( File ).optional(),
  } );


  const navigate = useNavigate();
  const [ selectedPlatforms, setSelectedPlatforms ] = useState( [] );
  const [ imagePreview, setImagePreview ] = useState<string | null>( null );
  const [ platforms, setPlatforms ] = useState( [] );
  const [ loading, setLoading ] = useState( false );

  // const [ platformPage, setPlatformPage ] = useState( 1 );
  // const [ platformsHasMore, setPlatformsHasMore ] = useState( true );

  const [ platformLoading, setPlatformLoading ] = useState( false );
  const fetchPlatforms = async () =>
  {
    setPlatformLoading( true );
    try
    {
      const response = await getAllPlatforms();
      const newPlatforms = response.data.platforms;
      setPlatforms( [
        ...newPlatforms.filter( ( p ) => p.pivot.status === "active" ),
        ...newPlatforms.filter( ( p ) => p.pivot.status === "inactive" ),
        ...newPlatforms.filter( ( p ) => p.pivot.status !== "active" && p.pivot.status !== "inactive" ),
      ] );
      // setPlatforms( newPlatforms );

      // setPlatformsHasMore( pageToLoad < response.data.last_page );
    } catch ( error )
    {
      console.error( 'Error fetching platforms:', error );
    } finally
    {
      setPlatformLoading( false );
    }
  };

  const getPlatformStatusBadge = ( status: string | null | undefined ) =>
  {
    if ( !status )
    {
      return <Badge className="bg-admin-primary-light  hover:bg-admin-primary text-black">
        <Link to={ '/platforms' } className="">
          Link it 
        </Link>
      </Badge>;
    }
    const variants = {
      active: 'bg-green-100 text-green-800 hover:bg-green-200',
      inactive: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    };
    return (
      <Badge className={ variants[ status as keyof typeof variants ] || 'bg-gray-100 text-gray-800' }>
        <Link to={ '/platforms' } className="">
        { status }
        </Link>
      </Badge>
    );
  };

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
    resolver: zodResolver( createPostSchema ),
    defaultValues: {
      platforms: selectedPlatforms,
    },
  } );


  const contentValue = watch( 'content', '' );
  const characterCount = contentValue.length;

  const handlePlatformChange = ( platformId, checked, charLimit ) =>
  {
    let updatedPlatforms = [];
    let newMaxCharLimit = 280; // Default value

    if ( checked )
    {
      updatedPlatforms = [ ...selectedPlatforms, platformId ];
      // Find all selected platforms' char limits
      const selectedPlatformsCharLimits = updatedPlatforms.map( id =>
      {
        const platform = platforms.find( p => p.id === id );
        return platform?.char_limit || 280;
      } );
      // Set the max to the minimum of all selected platforms' limits
      newMaxCharLimit = Math.min( ...selectedPlatformsCharLimits );
    } else
    {
      updatedPlatforms = selectedPlatforms.filter( id => id !== platformId );
      if ( updatedPlatforms.length > 0 )
      {
        const selectedPlatformsCharLimits = updatedPlatforms.map( id =>
        {
          const platform = platforms.find( p => p.id === id );
          return platform?.char_limit || 280;
        } );
        newMaxCharLimit = Math.min( ...selectedPlatformsCharLimits );
      } else
      {
        newMaxCharLimit = 280; // Reset to default if no platforms selected
      }
    }

    setSelectedPlatforms( updatedPlatforms );
    setValue( 'platforms', updatedPlatforms );
    setMaxCharLimit( newMaxCharLimit );
  };

  const handleImageUpload = ( event: React.ChangeEvent<HTMLInputElement> ) =>
  {
    const file = event.target.files?.[ 0 ];
    if ( file )
    {
      // Set the file in form state
      setValue( 'image', file );

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () =>
      {
        setImagePreview( reader.result as string );
      };
      reader.readAsDataURL( file );
    }
  };
  

  const onSubmit = async ( data ) =>
  {
    try
    {
      // Create FormData for file upload
      setLoading( true );
      const formData = new FormData();
      formData.append( 'title', data.title );
      formData.append( 'content', data.content );
      data.platforms.forEach( platformId =>
      {
        formData.append( 'platforms[]', platformId.toString() );
      } );

      if ( data.scheduledDate && data.scheduledTime)
      {
        formData.append( 'scheduled_time', `${data.scheduledDate} ${data.scheduledTime}` );
      }

      if ( data.image )
      {
        formData.append( 'image', data.image );
      }

      // Here you would typically make your API call with formData
      console.log( 'Form data to be sent:', formData );

      await createPost( formData );
      // Example API call (you'll need to implement this):
      // const response = await createPost(formData);
      toast( {
        title: "Post created!",
        description: "Your post has been successfully created.",
      } );

      navigate( '/posts' );
    } catch ( error )
    {
      toast( {
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      } );
      console.error( 'Error creating post:', error );
    }finally
    {
      setLoading( false );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-gray-600">Compose and schedule your social media content</p>
        </div>
        <Button
          variant="outline"
          onClick={ () => navigate( '/posts' ) }
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Posts
        </Button>
      </div>

      <form onSubmit={ handleSubmit( onSubmit ) } className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter post title..."
                  { ...register( 'title' ) }
                  disabled={ loading }
                />
                { errors.title && (
                  <p className="text-sm text-destructive">{ errors.title.message }</p>
                ) }
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="content">Content</Label>
                  <span className={ `text-sm ${ characterCount > maxCharLimit * 0.85 ? 'text-destructive' : 'text-gray-500' }` }>
                    { characterCount }/{ maxCharLimit }
                  </span>
                </div>
                <Textarea
                  id="content"
                  placeholder="What's happening?"
                  rows={ 5 }
                  { ...register( 'content' ) }
                  disabled={ loading }
                  maxLength={ maxCharLimit }
                />
                { errors.content && (
                  <p className="text-sm text-destructive">{ errors.content.message }</p>
                ) }
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  { imagePreview ? (
                    <div className="space-y-2">
                      <img
                        src={ imagePreview }
                        alt="Preview"
                        className="max-w-full h-48 object-cover mx-auto rounded"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={ () => setImagePreview( null ) }
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                      <div>
                        <Label htmlFor="image-upload" className="cursor-pointer text-admin-primary hover:underline">
                          Click to upload
                        </Label>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={ handleImageUpload }
                          className="hidden"
                          disabled={ loading }
                        />
                        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  ) }
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                { platformLoading && <PlatformsSkelton /> }
                { platforms && platforms.map( ( platform ) => (
                  <div key={ platform.id } className="flex items-center space-x-2 bg-gray-200 p-3 rounded ">
                    <Checkbox
                      id={ platform.id }
                      checked={ selectedPlatforms.includes( platform.id ) }
                      onCheckedChange={ ( checked ) =>
                        handlePlatformChange( platform.id, checked as boolean, platform.char_limit )
                      }
                      disabled={ !platform.is_synced || platform.pivot?.status !== 'active' || loading }
                    />
                    <Label
                      htmlFor={ platform.id }
                      
                    >
                      { platform.name }
                      <span className='ms-4'>
                        { getPlatformStatusBadge( platform.pivot.status ) }
                      </span>
                    </Label>
                  </div>
                ) ) }
                { errors.platforms && (
                  <p className="text-sm text-destructive">{ errors.platforms.message }</p>
                ) }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="scheduledDate"
                    type="date"
                    className="pl-10"
                    min={new Date().toISOString().split('T')[0]}
                    {...register('scheduledDate')}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="scheduledTime"
                    type="time"
                    className="pl-10"
                    min={
                      // If selected date is today, set min to current time, else allow any time
                      watch('scheduledDate') === new Date().toISOString().split('T')[0]
                        ? new Date().toTimeString().slice(0, 5)
                        : undefined
                    }
                    {...register('scheduledTime')}
                    disabled={loading}
                  />
                </div>
              </div>

              <p className="text-sm text-gray-500">
                Leave empty to save as draft
              </p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button type="submit" disabled={ loading } className="w-full bg-admin-primary hover:bg-admin-primary-dark">
              {loading ? "Creating Post ......." : "Create Post"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={ () => navigate( '/posts' ) }
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;