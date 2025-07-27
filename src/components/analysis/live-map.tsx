'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, type LatLngExpression } from 'leaflet';

type Hotspot = {
  id: number;
  position: LatLngExpression;
  disease: string;
  color: string;
};

type LiveMapProps = {
  hotspots: Hotspot[];
};

// Custom icon creation
const createCircleIcon = (color: string) => {
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" fill="${color}" stroke="white" stroke-width="2" opacity="0.8"/>
        <circle cx="12" cy="12" r="11" fill="${color}" opacity="0.3"/>
      </svg>
    `)}`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const LiveMap = ({ hotspots }: LiveMapProps) => {
  const mapCenter: LatLngExpression = [39.0, 35.0]; // Centered on Turkey

  return (
    <MapContainer center={mapCenter} zoom={6} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {hotspots.map((hotspot) => (
        <Marker 
          key={hotspot.id} 
          position={hotspot.position}
          icon={createCircleIcon(hotspot.color)}
        >
          <Popup>
            <div className="font-bold">{hotspot.disease}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LiveMap;
