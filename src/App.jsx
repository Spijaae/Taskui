import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AuthErrorToast from "@/components/AuthErrorToast";
import { MobileNavProvider } from "@/components/MobileNavProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SearchPaletteProvider } from "@/components/SearchPalette";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";

const Chat = React.lazy(() => import("@/pages/Chat"));
const MemoryVault = React.lazy(() => import("@/pages/MemoryVault"));
const Profile = React.lazy(() => import("@/pages/Profile"));
const Analytics = React.lazy(() => import("@/pages/Analytics"));
const Today = React.lazy(() => import("@/pages/Today"));
const Setup = React.lazy(() => import("@/pages/Setup"));
const Memories = React.lazy(() => import("@/pages/Memories"));
const MemoryDetail = React.lazy(() => import("@/pages/MemoryDetail"));
const Calendar = React.lazy(() => import("@/pages/Calendar"));
const Gallery = React.lazy(() => import("@/pages/Gallery"));
const Settings = React.lazy(() => import("@/pages/Settings"));
const More = React.lazy(() => import("@/pages/More"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

const protectedRoutes = [
  ["/setup", Setup],
  ["/today", Today],
  ["/memories", Memories],
  ["/memories/:id", MemoryDetail],
  ["/chat", Chat],
  ["/calendar", Calendar],
  ["/gallery", Gallery],
  ["/memory-vault", MemoryVault],
  ["/profile", Profile],
  ["/analytics", Analytics],
  ["/settings", Settings],
  ["/more", More],
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <AuthErrorToast />
          <SearchPaletteProvider>
            <MobileNavProvider>
              <React.Suspense fallback={<div className="min-h-dvh bg-alma-canvas" />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  {protectedRoutes.map(([path, Page]) => (
                    <Route
                      key={path}
                      path={path}
                      element={
                        <ProtectedRoute>
                          <Page />
                        </ProtectedRoute>
                      }
                    />
                  ))}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </React.Suspense>
            </MobileNavProvider>
          </SearchPaletteProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
