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

function makePin(fill, strokeColor = 'white', strokeWidth = 2) {
  return L.divIcon({
    className: '',
    html: `<div style="width:34px;height:44px;filter:drop-shadow(0 6px 8px rgba(60,30,10,0.32))">
      <svg viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 0C7.611 0 0 7.611 0 17c0 11.55 17 27 17 27S34 28.55 34 17C34 7.611 26.389 0 17 0z"
          fill="${fill}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
        <circle cx="17" cy="17" r="6.5" fill="white"/>
      </svg>
    </div>`,
    iconSize:    [34, 44],
    iconAnchor:  [17, 44],
    popupAnchor: [0, -44],
  });
}

const wishlistPin = makePin('#F5622D');
const visitedPin  = makePin('#2D6A4F');

function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target?.lat != null) map.flyTo([target.lat, target.lng], 14, { duration: 1.2 });
  }, [target, map]);
  return null;
}

function MapControl({ onMapReady }) {
  const map = useMap();
  useEffect(() => {
    if (onMapReady) onMapReady(map);
  }, [map, onMapReady]);
  return null;
}

export default function MapView({ restaurants, flyTarget, onPinClick, onMapReady }) {
  const withCoords = restaurants.filter(r => r.lat != null && r.lng != null);
  const center = withCoords.length ? [withCoords[0].lat, withCoords[0].lng] : [11.25, 75.78];

  return (
    <MapContainer center={center} zoom={8} style={{ width: '100%', height: '100%' }} zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {withCoords.map(r => (
        <Marker
          key={r.id}
          position={[r.lat, r.lng]}
          icon={r.status === 'visited' ? visitedPin : wishlistPin}
          eventHandlers={onPinClick ? { click: () => onPinClick(r) } : {}}
        />
      ))}
      {flyTarget && <FlyTo target={flyTarget} />}
      {onMapReady && <MapControl onMapReady={onMapReady} />}
    </MapContainer>
  );
}
