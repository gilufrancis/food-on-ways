import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RestaurantProvider } from './context/RestaurantContext';
import Navbar from './components/Navbar';
import Home from './pages/Explore';
import Map from './pages/Map';
import Wishlist from './pages/Wishlist';
import Visited from './pages/Visited';
import Profile from './pages/Profile';

export default function App() {
  return (
    <RestaurantProvider>
      <BrowserRouter>
        {/*
          Outer shell: warm parchment fills the browser window.
          Inner shell: max-w-md "phone" container, centred, with a warm depth shadow.
        */}
        <div
          className="min-h-screen flex justify-center"
          style={{ backgroundColor: '#2A201A' }}
        >
          <div
            className="w-full max-w-md flex flex-col relative"
            style={{
              minHeight: '100dvh',
              backgroundColor: 'var(--surface)',
              boxShadow: '0 0 0 1px rgba(46,37,32,0.07), 0 32px 80px rgba(46,37,32,0.22)',
            }}
          >
            <Navbar />
            <main className="flex-1 min-w-0">
              <Routes>
                <Route path="/"         element={<Home />} />
                <Route path="/map"      element={<Map />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/visited"  element={<Visited />} />
                <Route path="/profile"  element={<Profile />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </RestaurantProvider>
  );
}
