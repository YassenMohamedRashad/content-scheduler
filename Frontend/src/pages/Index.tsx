
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BarChart3, Settings, FileText } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-admin-primary/10 to-admin-secondary/10">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Content Management
            <span className="block text-admin-primary">Admin Panel</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A modern, feature-rich admin panel for managing your content across multiple platforms.
            Built with React, Tailwind CSS, and shadcn/ui components.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-admin-primary hover:bg-admin-primary-dark">
              <Link to="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <Calendar className="w-12 h-12 text-admin-primary mx-auto mb-4" />
              <CardTitle>Content Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Schedule and manage your posts across multiple platforms with ease.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="w-12 h-12 text-admin-secondary mx-auto mb-4" />
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track your content performance with detailed analytics and insights.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Settings className="w-12 h-12 text-admin-accent mx-auto mb-4" />
              <CardTitle>Platform Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Enable and configure multiple social media platforms from one place.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <FileText className="w-12 h-12 text-admin-success mx-auto mb-4" />
              <CardTitle>Post Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create and edit posts with a powerful editor and real-time preview.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
