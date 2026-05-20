import { useRestaurants } from '../context/RestaurantContext';
import RestaurantCard from '../components/RestaurantCard';
import PageWrapper from '../components/PageWrapper';

export default function Visited() {
  const { restaurants } = useRestaurants();
  const visited = restaurants.filter((r) => r.status === 'visited');

  const avgRating = visited.length
    ? (visited.reduce((s, r) => s + (r.rating || 0), 0) / visited.filter((r) => r.rating).length || 0).toFixed(1)
    : null;

  return (
    <PageWrapper>
      {/* Page header */}
      <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '1px solid #bbf7d0' }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">✅</div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-extrabold text-gray-900">Visited</h1>
            <div className="flex items-center gap-3 mt-0.5">
              <p className="text-sm text-green-600 font-medium">{visited.length} places visited</p>
              {avgRating && !isNaN(avgRating) && Number(avgRating) > 0 && (
                <span className="flex items-center gap-1 text-sm text-amber-500 font-semibold">
                  <span>★</span> {avgRating} avg
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {visited.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">✅</div>
          <p className="text-gray-800 font-bold text-lg">No visited restaurants yet</p>
          <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">
            Open a restaurant from your wishlist and mark it as visited
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visited.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} showRating />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
