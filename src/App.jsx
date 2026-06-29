import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ItemsFeed from './pages/ItemsFeed'; // NEW: Imported the ItemsFeed page

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Toaster position="top-right" />

          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* We added the road sign for the Register page here! */}
            <Route path="/register" element={<Register />} />

            {/* NEW: Added the protected route for the Lost & Found Feed */}
            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <ItemsFeed />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* If a user types a random URL, send them back to the dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;