import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'


// fix default icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})


export default function MapSection({ center = [12.9716, 77.5946], zoom = 13, markers = [] }) {
return (
<MapContainer center={center} zoom={zoom} className="leaflet-container rounded">
<TileLayer
attribution='&copy; OpenStreetMap contributors'
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>


{markers.map((m) => (
<Marker key={`${m.id}-${m.lat}-${m.lng}`} position={[m.lat, m.lng]}>
<Popup>
<div className="text-sm">
<strong>{m.name}</strong>
<div>{m.place_type}</div>
<div>{m.address}</div>
</div>
</Popup>
</Marker>
))}
</MapContainer>
)
}