import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RestaurantProvider } from './context/RestaurantContext';
import Navbar from './components/Navbar';
import Map from './pages/Map';
import Explore from './pages/Explore';
import Wishlist from './pages/Wishlist';
import Visited from './pages/Visited';
import Profile from './pages/Profile';

export default function App() {
  return (
    <RestaurantProvider>
      <BrowserRouter>
        <div
          className="flex flex-col md:flex-row min-h-screen"
          style={{ backgroundColor: 'var(--surface)' }}
        >
          <Navbar />
          <main className="flex-1 min-w-0">
            <Routes>
              <Route path="/"         element={<Map />} />
              <Route path="/explore"  element={<Explore />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/visited"  element={<Visited />} />
              <Route path="/profile"  element={<Profile />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </RestaurantProvider>
  );
}
