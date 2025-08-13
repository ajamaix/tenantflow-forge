import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import LoginForm from "@/components/Auth/LoginForm";
import RegisterForm from "@/components/Auth/RegisterForm";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import SuperAdmin from "@/pages/SuperAdmin";
import Products from "@/pages/Products";
import Plans from "@/pages/Plans";
import Team from "@/pages/Team";
import Analytics from "@/pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requireSuperAdmin?: boolean }> = ({ 
  children, 
  requireSuperAdmin = false 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireSuperAdmin && user.role !== 'super_admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/dashboard" replace /> : <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-full max-w-md"><RegisterForm /></div></div>} 
      />
      <Route 
        path="/super-admin/login" 
        element={user ? <Navigate to="/super-admin" replace /> : <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-full max-w-md"><LoginForm isSuperAdmin={true} /></div></div>} 
      />

      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/products" 
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/products/:id/plans" 
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/plans" 
        element={
          <ProtectedRoute>
            <Plans />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/plans/new" 
        element={
          <ProtectedRoute>
            <Plans />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/products/new" 
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/team" 
        element={
          <ProtectedRoute>
            <Team />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/team/invite" 
        element={
          <ProtectedRoute>
            <Team />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      {/* Super Admin routes */}
      <Route 
        path="/super-admin" 
        element={
          <ProtectedRoute requireSuperAdmin={true}>
            <SuperAdmin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/super-admin/tenants" 
        element={
          <ProtectedRoute requireSuperAdmin={true}>
            <SuperAdmin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/super-admin/analytics" 
        element={
          <ProtectedRoute requireSuperAdmin={true}>
            <SuperAdmin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/super-admin/settings" 
        element={
          <ProtectedRoute requireSuperAdmin={true}>
            <SuperAdmin />
          </ProtectedRoute>
        } 
      />

      {/* Redirect root to appropriate dashboard */}
      <Route 
        path="/" 
        element={
          user ? (
            user.role === 'super_admin' ? (
              <Navigate to="/super-admin" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
