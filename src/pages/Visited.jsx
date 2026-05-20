import { useRestaurants } from '../context/RestaurantContext';
import RestaurantCard from '../components/RestaurantCard';
import PageWrapper from '../components/PageWrapper';

export default function Visited() {
  const { restaurants } = useRestaurants();
  const visited = restaurants.filter(r => r.status === 'visited');

  const rated   = visited.filter(r => r.rating);
  const avgRating = rated.length
    ? (rated.reduce((s, r) => s + r.rating, 0) / rated.length).toFixed(1)
    : null;

  return (
    <PageWrapper>
      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
          style={{ background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)' }}
        >
          ✅
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 leading-tight">Visited</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-gray-500">
              {visited.length} {visited.length === 1 ? 'place' : 'places'} visited
            </p>
            {avgRating && (
              <>
                <span className="text-gray-300">·</span>
                <span className="text-xs font-semibold text-amber-500">★ {avgRating} avg</span>
              </>
            )}
          </div>
        </div>
      </div>

      {visited.length === 0 ? (
        <div className="flex flex-col items-center text-center py-16 px-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
            style={{ backgroundColor: '#f0fdf4' }}
          >
            ✅
          </div>
          <p className="text-lg font-bold text-gray-800">No visited places yet</p>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed max-w-xs">
            Open any wishlist restaurant and mark it as visited
          </p>
        </div>
      ) : (
        <div className="px-4 flex flex-col gap-3">
          {visited.map(r => <RestaurantCard key={r.id} restaurant={r} showRating />)}
        </div>
      )}
    </PageWrapper>
  );
}
