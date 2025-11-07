import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { OrkutProfile as OrkutProfileComponent } from './components/OrkutProfile';
import Dashboard from './pages/Dashboard';
import Communities from './pages/Communities';
import Chat from './pages/Chat';
import ChatMSN from './pages/ChatMSN';
import OrkutProfile from './pages/OrkutProfile';
import Feed from './pages/Feed';
import AudioRooms from './pages/AudioRooms';
import P2PShare from './pages/P2PShare';
import Login from './pages/Login';
import Register from './pages/Register';
import GistMemory from './components/GistMemory';
import VoiceChat from './components/VoiceChat';
import LiveKitRooms from './components/LiveKitRooms';

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

  const mockUser = {
    name: 'Vinicius Junior',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ViniciusJuniorMale&backgroundColor=b6e3f4&clothesColor=262e33&eyebrowType=defaultNatural&eyeType=default&facialHairColor=2c1b18&facialHairType=beardMedium&hairColor=2c1b18&hatColor=3c4f5c&mouthType=smile&skinColor=ae5d29&topType=shortHairShortFlat&accessoriesType=blank',
    friends: 100000,
    fans: 80,
    views: 999,
    rating: 5,
    relationship: 'Casado 💍'
  };



  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Profile */}
          <div className="col-span-12 lg:col-span-3">
            <OrkutProfileComponent user={mockUser} />
            
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
              <Route path="/chat-msn" element={<ChatMSN />} />
              <Route path="/profile" element={<OrkutProfile />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/audio" element={<AudioRooms />} />
              <Route path="/p2p" element={<P2PShare />} />
              <Route path="/gist-memory" element={<GistMemory />} />
              <Route path="/voice-chat" element={<VoiceChat />} />
              <Route path="/livekit-rooms" element={<LiveKitRooms />} />
            </Routes>
          </div>
        </div>
      </div>


    </div>
  );
}

import DashboardWithWindows from "./pages/DashboardWithWindows";

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Desktop-like experience */}
        <Route path="/chat-msn-desktop" element={<ChatMSN />} />
        <Route path="/dashboard-windows" element={<DashboardWithWindows />} />
        
        {/* Protected Routes with Main Layout */}
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
