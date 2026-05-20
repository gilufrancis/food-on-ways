import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RestaurantProvider } from './context/RestaurantContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Map from './pages/Map';
import Wishlist from './pages/Wishlist';
import Visited from './pages/Visited';
import Profile from './pages/Profile';

export default function App() {
  return (
    <RestaurantProvider>
      <BrowserRouter>
        <div className="flex min-h-screen" style={{ backgroundColor: '#f8f9fb' }}>
          <Navbar />

          {/* Main content area.
              On mobile: top bar is sticky so no top offset needed.
              Bottom nav is fixed — pages add their own bottom clearance via pb-safe. */}
          <main className="flex-1 min-w-0 flex flex-col min-h-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<Map />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/visited" element={<Visited />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </RestaurantProvider>
  );
}
