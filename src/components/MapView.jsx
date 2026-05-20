import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icon issue with webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function makeIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:28px;height:36px;position:relative;
    ">
      <svg viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 0C6.268 0 0 6.268 0 14c0 9.334 14 22 14 22S28 23.334 28 14C28 6.268 21.732 0 14 0z" fill="${color}"/>
        <circle cx="14" cy="14" r="6" fill="white"/>
      </svg>
    </div>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  });
}

const wishlistIcon = makeIcon('#ff5c28');
const visitedIcon = makeIcon('#22c55e');

function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 14, { duration: 1.2 });
  }, [target, map]);
  return null;
}

export default function MapView({ restaurants, flyTarget }) {
  const withCoords = restaurants.filter((r) => r.lat != null && r.lng != null);
  const center = withCoords.length ? [withCoords[0].lat, withCoords[0].lng] : [10.5, 76.2];

  return (
    <MapContainer center={center} zoom={7} style={{ width: '100%', height: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {withCoords.map((r) => (
        <Marker
          key={r.id}
          position={[r.lat, r.lng]}
          icon={r.status === 'visited' ? visitedIcon : wishlistIcon}
        >
          <Popup>
            <div className="text-center min-w-[120px]">
              <span className="text-2xl">{r.emoji}</span>
              <p className="font-semibold text-gray-900 mt-1">{r.name}</p>
              {r.cuisine && <p className="text-xs text-gray-500">{r.cuisine}</p>}
              {r.location && <p className="text-xs text-gray-500">{r.location}</p>}
              <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${
                r.status === 'visited' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {r.status === 'visited' ? 'Visited' : 'Wishlist'}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
      {flyTarget && <FlyTo target={flyTarget} />}
    </MapContainer>
  );
}
