import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import NotFound from "./pages/NotFound";
import Dashboard from "@/pages/admin/Dashboard";
import Posts from "@/pages/admin/Posts";
import CreatePost from "@/pages/admin/CreatePost";
import Platforms from "@/pages/admin/Platforms";
import Profile from "@/pages/admin/Profile";
import ActivityLog from "@/pages/admin/ActivityLog";

import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthCheckContext";
import UpdatePost from "@/pages/admin/UpdatePost";

const queryClient = new QueryClient( {
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
} );

const App = () => (
  <QueryClientProvider client={ queryClient }>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ <Index /> } />
            <Route path="/auth/signin" element={ <SignIn /> } />
            <Route path="/auth/signup" element={ <SignUp /> } />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={ <Navigate to="/dashboard" replace /> } />
              <Route path="dashboard" element={ <Dashboard /> } />
              <Route path="posts" element={ <Posts /> } />
              <Route path="posts/create" element={ <CreatePost /> } />
              <Route path="posts/edit/:id" element={ <UpdatePost /> } />
              <Route path="platforms" element={ <Platforms /> } />
              <Route path="profile" element={ <Profile /> } />
              <Route path="activity" element={ <ActivityLog /> } />
            </Route>

            <Route path="*" element={ <NotFound /> } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
