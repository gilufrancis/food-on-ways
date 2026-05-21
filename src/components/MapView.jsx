import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function makeIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:30px;height:40px;filter:drop-shadow(0 4px 6px rgba(60,30,10,0.32))">
      <svg viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0C6.716 0 0 6.716 0 15c0 10.25 15 25 15 25S30 25.25 30 15C30 6.716 23.284 0 15 0z" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="15" cy="15" r="6" fill="white"/>
      </svg>
    </div>`,
    iconSize:    [30, 40],
    iconAnchor:  [15, 40],
    popupAnchor: [0, -40],
  });
}

const wishlistIcon = makeIcon('#F5622D');
const visitedIcon  = makeIcon('#2D6A4F');

function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target?.lat != null) map.flyTo([target.lat, target.lng], 14, { duration: 1.2 });
  }, [target, map]);
  return null;
}

export default function MapView({ restaurants, flyTarget, onPinClick }) {
  const withCoords = restaurants.filter(r => r.lat != null && r.lng != null);
  const center = withCoords.length ? [withCoords[0].lat, withCoords[0].lng] : [10.5, 76.2];

  return (
    <MapContainer center={center} zoom={7} style={{ width: '100%', height: '100%' }} zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {withCoords.map(r => (
        <Marker
          key={r.id}
          position={[r.lat, r.lng]}
          icon={r.status === 'visited' ? visitedIcon : wishlistIcon}
          eventHandlers={onPinClick ? { click: () => onPinClick(r) } : {}}
        />
      ))}
      {flyTarget && <FlyTo target={flyTarget} />}
    </MapContainer>
  );
}
