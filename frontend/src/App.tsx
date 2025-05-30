import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // ✅ Toast library

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PredictionDetails from './pages/PredictionDetails';
import Prediction from './pages/Prediction';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import NotFound from './pages/NotFound';
import PredictionHistory from './pages/PredictionHistory';
import AddVehicleForm from './components/AddVehicleForm';
import VehicleList from './pages/VehicleList';
import VehicleDetails from './pages/VehicleDetails';
import Dashboard from './pages/Dashboard';
import NewsPage from './pages/NewsPage';

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ✅ Toast container (used globally) */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#f0fdf4',
            color: '#15803d',
            fontWeight: '500',
          },
        }}
      />

      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/prediction-details" element={<PredictionDetails />} />
          <Route 
            path="/prediction" 
            element={
              <ProtectedRoute>
                <Prediction />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/prediction/:id" 
            element={
              <ProtectedRoute>
                <Prediction />
              </ProtectedRoute>
            } 
          />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route 
            path="/admin-dashboard" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
          <Route path="/history" element={<PredictionHistory />} />

          <Route path="/vehicles/add" element={<AddVehicleForm />} /> 
          <Route path="/vehicles" element={<VehicleList />} />  
          <Route path="/vehicles/:id" element={<VehicleDetails />} />  
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />    
          <Route path="/news" element={<NewsPage />} />
       </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
