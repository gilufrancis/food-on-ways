import { useRestaurants } from '../context/RestaurantContext';
import RestaurantCard from '../components/RestaurantCard';
import PageWrapper from '../components/PageWrapper';

export default function Wishlist() {
  const { restaurants } = useRestaurants();
  const wishlist = restaurants.filter((r) => r.status === 'wishlist');

  return (
    <PageWrapper>
      {/* Page header */}
      <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', border: '1px solid #fed7aa' }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">❤️</div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Wishlist</h1>
            <p className="text-sm text-orange-600 font-medium">{wishlist.length} places to visit</p>
          </div>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">❤️</div>
          <p className="text-gray-800 font-bold text-lg">Your wishlist is empty</p>
          <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">
            Tap <span className="font-semibold text-orange-500">+ Add</span> to save restaurants you want to visit
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {wishlist.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
