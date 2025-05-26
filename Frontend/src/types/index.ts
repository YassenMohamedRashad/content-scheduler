
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  image?: string;
  status: 'draft' | 'scheduled' | 'published';
  platforms: string[];
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Platform {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
  color: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  userId: string;
}

export interface Analytics {
  postsPerPlatform: { platform: string; count: number }[];
  statusCounts: { status: string; count: number }[];
  successRate: number;
  totalPosts: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
