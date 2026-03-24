import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import DashboardPage from './pages/DashboardPage';
import FirebaseSetupPage from './pages/FirebaseSetupPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ProductFormPage from './pages/ProductFormPage';
import ProductsPage from './pages/ProductsPage';
import RegisterPage from './pages/RegisterPage';
import { firebaseStatus } from './services/firebase/client';

function App() {
  if (!firebaseStatus.isConfigured) {
    return (
      <>
        <FirebaseSetupPage />
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            className: '!border !border-white/10 !bg-slate-900/95 !text-slate-100',
          }}
        />
      </>
    );
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/new" element={<ProductFormPage />} />
            <Route path="products/:productId" element={<ProductDetailsPage />} />
            <Route path="products/:productId/edit" element={<ProductFormPage />} />
          </Route>
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            className: '!border !border-white/10 !bg-slate-900/95 !text-slate-100',
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
