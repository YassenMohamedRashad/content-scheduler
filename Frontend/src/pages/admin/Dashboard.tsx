
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, FileText, TrendingUp, Users } from 'lucide-react';
import { getDashboardAnalytics } from '@/services/analyticsService';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton'; 
import { Badge } from '@/components/ui/badge';


const Dashboard: React.FC = () =>
{
  const [ loading, setLoading ] = useState( false )
  const [ data, setData ] = useState( {} )
  

  const fetchAnalyticsData = async () =>
    {
      try
      {
        setLoading( true );
        const response = await getDashboardAnalytics();
        setData(response.data);
      } catch ( error )
      {
        console.error( 'Error fetching platforms:', error );
        toast( {
          title: "Error",
          description: "Failed to fetch Data. Please try again.",
          variant: "destructive",
        } );
      } finally
      {
        setLoading(false);
      }
  };
  
  const formatTimestamp = ( timestamp: string ) =>
  {
    const date = new Date( timestamp );
    if ( isNaN( date.getTime() ) ) return 'Invalid date';
    return date.toLocaleString();
    };

  useEffect( () =>
  {
    fetchAnalyticsData()
  },[])
  return (
    <>
    {loading && <Skeleton/>}
    {data && <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your social media management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{ data.total_posts }</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{ data.scheduled }</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platforms</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{data.active_platforms}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest social media actions</CardDescription>
          </CardHeader>
            <CardContent>
              <div className="space-y-4">
              {
                data.recent_activities && data.recent_activities.map( (act) =>
                
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-admin-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{act.description}</p>
                      <p className="text-xs text-muted-foreground">{ formatTimestamp(act.created_at) }</p>
                      </div>
                    </div>
                )
              }
              </div>
            
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Posts</CardTitle>
            <CardDescription>Your scheduled content</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="space-y-4">
                {
                  data.upcoming_posts && data.upcoming_posts.map( (post) =>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition">
                      <div className="flex items-center space-x-4">
                        <img
                          src={post.image_url}
                          alt="Post"
                          className="w-14 h-14 rounded-lg object-cover border border-gray-200 shadow-sm"
                        />
                        <div>
                          <p className="text-base font-semibold text-gray-900">{post.title || "Untitled Post"}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(post.platforms).map((p, idx) => (
                              <Badge
                                key={p.platform.id || idx}
                                className="bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-xs font-medium shadow-sm hover:bg-blue-200 transition"
                              >
                                <span className="flex items-center gap-1">
                                  {/* Optionally add an icon here */}
                                  {p.platform.name}
                                </span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        
                        {post.status && (
                          <span
                            className={`mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                              post.status === "scheduled"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                          </span>
                        ) }
                        <span className="text-xs font-medium text-admin-primary mt-3">
                          { formatTimestamp( post.scheduled_time ) }
                        </span>
                      </div>
                    </div>
                  )
                }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>}
    </>
  );
};

export default Dashboard;
