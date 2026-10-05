import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

import MainLayout from './layouts/MainLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// Eager load HomePage for instant first contentful paint
import HomePage from './pages/HomePage.jsx';

// Code-split pages for high performance
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const AffiliateDisclosurePage = lazy(() => import('./pages/AffiliateDisclosurePage.jsx'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage.jsx'));
const TermsPage = lazy(() => import('./pages/TermsPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

// Admin Code-Split Pages
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage.jsx'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage.jsx'));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage.jsx'));
const AdminProductEditorPage = lazy(() => import('./pages/admin/AdminProductEditorPage.jsx'));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage.jsx'));
const AdminRatingsPage = lazy(() => import('./pages/admin/AdminRatingsPage.jsx'));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage.jsx'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage.jsx'));

function PageLoader() {
  return (
    <div className="py-24 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes with MainLayout */}
              <Route
                path="/"
                element={
                  <MainLayout>
                    <HomePage />
                  </MainLayout>
                }
              />
              <Route
                path="/products/:slug"
                element={
                  <MainLayout>
                    <ProductDetailPage />
                  </MainLayout>
                }
              />
              <Route
                path="/about"
                element={
                  <MainLayout>
                    <AboutPage />
                  </MainLayout>
                }
              />
              <Route
                path="/affiliate-disclosure"
                element={
                  <MainLayout>
                    <AffiliateDisclosurePage />
                  </MainLayout>
                }
              />
              <Route
                path="/privacy-policy"
                element={
                  <MainLayout>
                    <PrivacyPolicyPage />
                  </MainLayout>
                }
              />
              <Route
                path="/terms"
                element={
                  <MainLayout>
                    <TermsPage />
                  </MainLayout>
                }
              />

              {/* Secret Admin Login (Stand-alone separate page) */}
              <Route path="/adashishmin/login" element={<AdminLoginPage />} />

              {/* Secret Admin Management Routes with AdminLayout */}
              <Route
                path="/adashishmin"
                element={
                  <AdminLayout>
                    <AdminDashboardPage />
                  </AdminLayout>
                }
              />
              <Route
                path="/adashishmin/products"
                element={
                  <AdminLayout>
                    <AdminProductsPage />
                  </AdminLayout>
                }
              />
              <Route
                path="/adashishmin/products/new"
                element={
                  <AdminLayout>
                    <AdminProductEditorPage />
                  </AdminLayout>
                }
              />
              <Route
                path="/adashishmin/products/:id/edit"
                element={
                  <AdminLayout>
                    <AdminProductEditorPage />
                  </AdminLayout>
                }
              />
              <Route
                path="/adashishmin/categories"
                element={
                  <AdminLayout>
                    <AdminCategoriesPage />
                  </AdminLayout>
                }
              />
              <Route
                path="/adashishmin/ratings"
                element={
                  <AdminLayout>
                    <AdminRatingsPage />
                  </AdminLayout>
                }
              />
              <Route
                path="/adashishmin/analytics"
                element={
                  <AdminLayout>
                    <AdminAnalyticsPage />
                  </AdminLayout>
                }
              />
              <Route
                path="/adashishmin/settings"
                element={
                  <AdminLayout>
                    <AdminSettingsPage />
                  </AdminLayout>
                }
              />

              {/* 404 Catch-all */}
              <Route
                path="*"
                element={
                  <MainLayout>
                    <NotFoundPage />
                  </MainLayout>
                }
              />
            </Routes>
          </Suspense>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
