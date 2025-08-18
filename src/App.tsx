import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";

import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminInventory from "./pages/admin/AdminInventory";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
          <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute requiredRole="admin">
              <AdminProducts />
            </ProtectedRoute>
          } />
          <Route path="/admin/products/new" element={
            <ProtectedRoute requiredRole="admin">
              <AddProduct />
            </ProtectedRoute>
          } />
          <Route path="/admin/products/edit/:id" element={
            <ProtectedRoute requiredRole="admin">
              <EditProduct />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute requiredRole="admin">
              <AdminAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/admin/inventory" element={
            <ProtectedRoute requiredRole="admin">
              <AdminInventory />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute requiredRole="admin">
              <AdminSettings />
            </ProtectedRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
</LanguageProvider>
</QueryClientProvider>
);

export default App;
