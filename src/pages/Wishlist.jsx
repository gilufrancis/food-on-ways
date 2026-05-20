import { useRestaurants } from '../context/RestaurantContext';
import RestaurantCard from '../components/RestaurantCard';
import PageWrapper from '../components/PageWrapper';

export default function Wishlist() {
  const { restaurants } = useRestaurants();
  const wishlist = restaurants.filter((r) => r.status === 'wishlist');

  return (
    <PageWrapper>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900 mb-0.5">Wishlist</h1>
        <p className="text-sm text-gray-500">{wishlist.length} places you want to visit</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">❤️</div>
          <p className="text-gray-600 font-semibold text-lg">Your wishlist is empty</p>
          <p className="text-gray-400 text-sm mt-2">
            Tap <span className="font-medium text-orange-500">+ Add</span> to start building your list
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {wishlist.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
