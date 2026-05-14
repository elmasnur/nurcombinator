import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import LanguageRedirect from "@/components/LanguageRedirect";
import LanguageLayout from "@/components/LanguageLayout";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Explore from "@/pages/Explore";
import ProjectCreate from "@/pages/ProjectCreate";
import ProjectProfile from "@/pages/ProjectProfile";
import ProjectDashboard from "@/pages/ProjectDashboard";
import OpenCallCreate from "@/pages/OpenCallCreate";
import OpenCallDetail from "@/pages/OpenCallDetail";
import MyProfile from "@/pages/MyProfile";
import MyApplications from "@/pages/MyApplications";
import Notifications from "@/pages/Notifications";
import Moderation from "@/pages/Moderation";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <main id="main">
          <Routes>
            {/* Bare paths → detect language and redirect */}
            <Route path="/" element={<LanguageRedirect />} />
            <Route path="/auth" element={<LanguageRedirect />} />
            <Route path="/explore" element={<LanguageRedirect />} />
            <Route path="/projects/new" element={<LanguageRedirect />} />
            <Route path="/p/:slug" element={<LanguageRedirect />} />
            <Route path="/p/:slug/dashboard" element={<LanguageRedirect />} />
            <Route path="/p/:slug/open-calls/new" element={<LanguageRedirect />} />
            <Route path="/open-calls/:id" element={<LanguageRedirect />} />
            <Route path="/me" element={<LanguageRedirect />} />
            <Route path="/me/applications" element={<LanguageRedirect />} />
            <Route path="/me/notifications" element={<LanguageRedirect />} />
            <Route path="/admin/moderation" element={<LanguageRedirect />} />

            {/* Language-prefixed routes */}
            <Route path="/:lang" element={<LanguageLayout />}>
              <Route index element={<Landing />} />
              <Route path="auth" element={<Auth />} />
              <Route path="explore" element={<Explore />} />
              <Route path="projects/new" element={<ProjectCreate />} />
              <Route path="p/:slug" element={<ProjectProfile />} />
              <Route path="p/:slug/dashboard" element={<ProjectDashboard />} />
              <Route path="p/:slug/open-calls/new" element={<OpenCallCreate />} />
              <Route path="open-calls/:id" element={<OpenCallDetail />} />
              <Route path="me" element={<MyProfile />} />
              <Route path="me/applications" element={<MyApplications />} />
              <Route path="me/notifications" element={<Notifications />} />
              <Route path="admin/moderation" element={<Moderation />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          </main>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
