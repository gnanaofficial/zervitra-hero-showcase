import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import ClientRoute from "@/components/ClientRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Login = lazy(() => import("./pages/Login"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const QuotationGenerator = lazy(() => import("./pages/admin/QuotationGenerator"));
const InvoiceGenerator = lazy(() => import("./pages/admin/InvoiceGenerator"));
const ClientDashboard = lazy(() => import("./pages/ClientDashboard"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// Service detail pages
const WebDevelopment = lazy(() => import("./pages/services/WebDevelopment"));
const AppDevelopment = lazy(() => import("./pages/services/AppDevelopment"));
const UIUXDesign = lazy(() => import("./pages/services/UIUXDesign"));
const MVPProduct = lazy(() => import("./pages/services/MVPProduct"));
const SocialMediaMarketing = lazy(() => import("./pages/services/SocialMediaMarketing"));
const MoreServices = lazy(() => import("./pages/services/MoreServices"));

const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/user-login" element={<Login />} />
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* Service detail pages */}
                  <Route path="/services/web-development" element={<WebDevelopment />} />
                  <Route path="/services/app-development" element={<AppDevelopment />} />
                  <Route path="/services/ui-ux-design" element={<UIUXDesign />} />
                  <Route path="/services/mvp-product" element={<MVPProduct />} />
                  <Route path="/services/social-media-marketing" element={<SocialMediaMarketing />} />
                  <Route path="/services/more" element={<MoreServices />} />

                  {/* Protected routes - Role-based */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/quotation-generator"
                    element={
                      <AdminRoute>
                        <QuotationGenerator />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/client/dashboard"
                    element={
                      <ClientRoute>
                        <ClientDashboard />
                      </ClientRoute>
                    }
                  />

                  {/* Legacy dashboard route - redirects based on role */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Unauthorized page */}
                  <Route path="/unauthorized" element={<Unauthorized />} />

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
