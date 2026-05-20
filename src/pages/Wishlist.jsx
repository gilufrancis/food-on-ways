import { useRestaurants } from '../context/RestaurantContext';
import RestaurantCard from '../components/RestaurantCard';
import PageWrapper from '../components/PageWrapper';

export default function Wishlist() {
  const { restaurants } = useRestaurants();
  const wishlist = restaurants.filter(r => r.status === 'wishlist');

  return (
    <PageWrapper>
      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
          style={{ background: 'linear-gradient(135deg, #ff5c28 0%, #ff7d45 100%)' }}
        >
          ❤️
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 leading-tight">Wishlist</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {wishlist.length} {wishlist.length === 1 ? 'place' : 'places'} to visit
          </p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center text-center py-16 px-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
            style={{ backgroundColor: '#fff7ed' }}
          >
            ❤️
          </div>
          <p className="text-lg font-bold text-gray-800">Your wishlist is empty</p>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed max-w-xs">
            Tap <span className="font-semibold text-orange-500">+ Add</span> to save a restaurant you want to visit
          </p>
        </div>
      ) : (
        <div className="px-4 flex flex-col gap-3">
          {wishlist.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
      )}
    </PageWrapper>
  );
}
