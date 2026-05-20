import { useRestaurants } from '../context/RestaurantContext';
import RestaurantCard from '../components/RestaurantCard';
import PageWrapper from '../components/PageWrapper';

export default function Visited() {
  const { restaurants } = useRestaurants();
  const visited = restaurants.filter((r) => r.status === 'visited');

  return (
    <PageWrapper>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900 mb-0.5">Visited</h1>
        <p className="text-sm text-gray-500">{visited.length} places you've been to</p>
      </div>

      {visited.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-gray-600 font-semibold text-lg">No visited restaurants yet</p>
          <p className="text-gray-400 text-sm mt-2">
            Mark a restaurant as visited to see it here
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {visited.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} showRating />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
