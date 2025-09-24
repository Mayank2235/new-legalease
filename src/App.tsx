import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';
import Features from '@/pages/Features';
import About from '@/pages/About';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ClientDashboard from '@/pages/dashboard/ClientDashboard';
import LawyerDashboard from '@/pages/dashboard/LawyerDashboard';
import { AdminDashboard } from '@/pages/dashboard/AdminDashboard';
import DashboardProfilePage from '@/pages/dashboard/ProfilePage';
import CasesPage from '@/pages/dashboard/CasesPage';

const App = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
      <Route path="/features" element={<Features />} />
      <Route path="/about" element={<About />} />

      {user && (
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={
            user.role === 'CLIENT' ? <ClientDashboard /> : 
            user.role === 'LAWYER' ? <LawyerDashboard /> : 
            user.role === 'ADMIN' ? <AdminDashboard /> : 
            <Navigate to="/login" />
          } />
          <Route path="profile" element={<DashboardProfilePage />} />
          <Route path="cases" element={<CasesPage />} />
        </Route>
      )}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
