import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RestaurantProvider } from './context/RestaurantContext';
import { VlogProvider } from './context/VlogContext';
import Navbar from './components/Navbar';
import Map from './pages/Map';
import Home from './pages/Explore';
import Wishlist from './pages/Wishlist';
import Visited from './pages/Visited';
import Vlogs from './pages/Vlogs';
import VlogPlayer from './pages/VlogPlayer';

export default function App() {
  return (
    <RestaurantProvider>
      <VlogProvider>
        <BrowserRouter>
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
                  <Route path="/"           element={<Map />} />
                  <Route path="/explore"    element={<Home />} />
                  <Route path="/wishlist"   element={<Wishlist />} />
                  <Route path="/visited"    element={<Visited />} />
                  <Route path="/vlogs"      element={<Vlogs />} />
                  <Route path="/vlogs/:id"  element={<VlogPlayer />} />
                </Routes>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </VlogProvider>
    </RestaurantProvider>
  );
}
