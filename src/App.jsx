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
        {/*
          Mobile  → flex-col: Navbar (header 56px) stacks ABOVE main content
          Desktop → md:flex-row: sidebar sits BESIDE main content
        */}
        <div className="flex flex-col md:flex-row min-h-screen" style={{ backgroundColor: '#f8f9fb' }}>
          <Navbar />
          <main className="flex-1 min-w-0">
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
