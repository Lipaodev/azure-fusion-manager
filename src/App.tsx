
import React from 'react'; // Added explicit React import
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import ADServers from "./pages/ADServers";
import ADUsers from "./pages/ADUsers";
import CreateADUser from "./pages/CreateADUser";
import ADGroups from "./pages/ADGroups";
import WebAppUsers from "./pages/WebAppUsers";
import Microsoft365 from "./pages/Microsoft365";
import Licenses from "./pages/Licenses";
import Reports from "./pages/Reports";
import EmailSettings from "./pages/EmailSettings";
import SSOConfiguration from "./pages/SSOConfiguration";
import SystemSettings from "./pages/SystemSettings";
import AuditLogs from "./pages/AuditLogs";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Clients from "./pages/Clients"; // Import the new Clients page

const queryClient = new QueryClient();

// ProtectedRoute component to handle authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" replace /> : <Login />
      } />
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ad-servers" element={<ADServers />} />
        <Route path="/ad-users" element={<ADUsers />} />
        <Route path="/ad-users/create" element={<CreateADUser />} />
        <Route path="/ad-groups" element={<ADGroups />} />
        <Route path="/webapp-users" element={<WebAppUsers />} />
        <Route path="/microsoft-365" element={<Microsoft365 />} />
        <Route path="/licenses" element={<Licenses />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/email-settings" element={<EmailSettings />} />
        <Route path="/sso" element={<SSOConfiguration />} />
        <Route path="/settings" element={<SystemSettings />} />
        <Route path="/audit" element={<AuditLogs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/clients" element={<Clients />} /> {/* Add the new Clients route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
