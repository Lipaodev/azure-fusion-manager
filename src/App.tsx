
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<MainLayout />}>
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
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
