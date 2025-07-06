import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
// import 'react-tooltip/dist/react-tooltip.css';


// Context Providers
import { AuthProvider } from './hooks/useAuth';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Register from './components/Register';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';

// Placeholder components
const FactCheckHistory = () => (
  <div className="text-center py-5">
    <i className="bi bi-clock-history display-4 text-muted"></i>
    <h4 className="mt-3">Fact-Check History</h4>
    <p className="text-muted">Your fact-checking history will appear here.</p>
  </div>
);

const Profile = () => (
  <div className="text-center py-5">
    <i className="bi bi-person-circle display-4 text-muted"></i>
    <h4 className="mt-3">Profile Settings</h4>
    <p className="text-muted">Profile management coming soon.</p>
  </div>
);

const Settings = () => (
  <div className="text-center py-5">
    <i className="bi bi-gear display-4 text-muted"></i>
    <h4 className="mt-3">Settings</h4>
    <p className="text-muted">Application settings coming soon.</p>
  </div>
);

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route path="/notes" element={
                <PrivateRoute>
                  <NotesList />
                </PrivateRoute>
              } />

              <Route path="/notes/new" element={
                <PrivateRoute>
                  <NoteEditor />
                </PrivateRoute>
              } />

              <Route path="/notes/:id" element={
                <PrivateRoute>
                  <NoteEditor />
                </PrivateRoute>
              } />

              <Route path="/history" element={
                <PrivateRoute>
                  <FactCheckHistory />
                </PrivateRoute>
              } />

              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />

              <Route path="/settings" element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              } />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/notes" replace />} />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/notes" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
