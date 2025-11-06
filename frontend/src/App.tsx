import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { OrkutProfile } from './components/OrkutProfile';
import { MSNChatWindow } from './components/MSNChatWindow';
import { MessageCircle } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Communities from './pages/Communities';
import Chat from './pages/Chat';
import Feed from './pages/Feed';
import AudioRooms from './pages/AudioRooms';
import P2PShare from './pages/P2PShare';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Main Layout Component
function MainLayout() {
  const [showChat, setShowChat] = useState(false);

  const mockUser = {
    name: 'Paulo Tuppy',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Paulo',
    friends: 150,
    fans: 80,
    views: 999,
    rating: 5
  };

  const mockContact = {
    name: 'João Silva',
    status: 'Online'
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Profile */}
          <div className="col-span-12 lg:col-span-3">
            <OrkutProfile user={mockUser} />
            
            {/* Friends Online */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Amigos Online</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-msn-green rounded-full"></div>
                  <span className="text-sm text-gray-700">João Silva</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-msn-green rounded-full"></div>
                  <span className="text-sm text-gray-700">Maria Santos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-msn-yellow rounded-full"></div>
                  <span className="text-sm text-gray-700">Pedro Costa</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Routes */}
          <div className="col-span-12 lg:col-span-9">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/communities" element={<Communities />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/audio" element={<AudioRooms />} />
              <Route path="/p2p" element={<P2PShare />} />
            </Routes>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-4 right-4 bg-msn-green text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition z-40"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* MSN Chat Window */}
      {showChat && (
        <MSNChatWindow
          contact={mockContact}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
