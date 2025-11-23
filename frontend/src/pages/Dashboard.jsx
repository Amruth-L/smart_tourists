import { motion } from 'framer-motion'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import React from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import api from '../api'
import Card from '../components/Card'

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

// Custom SOS icon
const sosIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMSA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDMgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkYwMDAwIi8+Cjwvc3ZnPg==',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
})

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in kilometers
}

// Fetch nearby places from Overpass API (OpenStreetMap)
async function fetchNearbyPlacesFromOverpass(lat, lng, radius, placeType) {
    const OVERPASS_API = 'https://overpass-api.de/api/interpreter'
    
    // Map place types to Overpass queries
    const queries = {
        hospital: `
            [out:json][timeout:25];
            (
              node["amenity"="hospital"](around:${radius},${lat},${lng});
              way["amenity"="hospital"](around:${radius},${lat},${lng});
              relation["amenity"="hospital"](around:${radius},${lat},${lng});
            );
            out center;
        `,
        restaurant: `
            [out:json][timeout:25];
            (
              node["amenity"~"^(restaurant|fast_food|cafe)$"](around:${radius},${lat},${lng});
              way["amenity"~"^(restaurant|fast_food|cafe)$"](around:${radius},${lat},${lng});
              relation["amenity"~"^(restaurant|fast_food|cafe)$"](around:${radius},${lat},${lng});
            );
            out center;
        `,
        attraction: `
            [out:json][timeout:25];
            (
              node["tourism"~"^(attraction|museum|monument)$"](around:${radius},${lat},${lng});
              way["tourism"~"^(attraction|museum|monument)$"](around:${radius},${lat},${lng});
              relation["tourism"~"^(attraction|museum|monument)$"](around:${radius},${lat},${lng});
              node["historic"](around:${radius},${lat},${lng});
              way["historic"](around:${radius},${lat},${lng});
              relation["historic"](around:${radius},${lat},${lng});
            );
            out center;
        `
    }
    
    const query = queries[placeType]
    if (!query) {
        console.error(`Unknown place type: ${placeType}`)
        return []
    }
    
    try {
        const response = await fetch(OVERPASS_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `data=${encodeURIComponent(query)}`
        })
        
        if (!response.ok) {
            throw new Error(`Overpass API error: ${response.status}`)
        }
        
        const data = await response.json()
        return data.elements || []
    } catch (error) {
        console.error(`Error fetching ${placeType} from Overpass API:`, error)
        return []
    }
}

// Transform Overpass API element to our format
function transformOverpassElement(element, placeType) {
    // Get coordinates - handle both node and way/relation (which use center)
    const lat = element.lat || (element.center && element.center.lat)
    const lng = element.lon || (element.center && element.center.lon)
    
    if (!lat || !lng) {
        return null
    }
    
    // Build address from available tags
    const tags = element.tags || {}
    let address = ''
    if (tags['addr:full']) {
        address = tags['addr:full']
    } else if (tags['addr:street'] || tags['addr:housenumber']) {
        address = [tags['addr:housenumber'], tags['addr:street']]
            .filter(Boolean)
            .join(' ')
        if (tags['addr:city']) {
            address += `, ${tags['addr:city']}`
        }
    } else if (tags['addr:city']) {
        address = tags['addr:city']
    }
    
    return {
        id: `overpass-${element.type}-${element.id}`,
        name: tags.name || tags['name:en'] || 'Unnamed Place',
        place_type: placeType,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        address: address || 'Address not available',
        description: tags.description || ''
    }
}

// Component to update map center when location changes
function MapUpdater({ center }) {
    const map = useMap()
    React.useEffect(() => {
        map.setView(center, map.getZoom())
    }, [center, map])
    return null
}

export default function Dashboard() {
    const userId = localStorage.getItem('userId')
    const userType = localStorage.getItem('userType')
    const [markers, setMarkers] = React.useState([])
    const [liveLocation, setLiveLocation] = React.useState(null)
    const [center, setCenter] = React.useState([12.9716, 77.5946])
    const [touristProfile, setTouristProfile] = React.useState(null)
    const [allTourists, setAllTourists] = React.useState([])
    const [sosAlerts, setSosAlerts] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [placesLoading, setPlacesLoading] = React.useState(false)
    const [placesError, setPlacesError] = React.useState(null)
    const [sosLoading, setSosLoading] = React.useState(false)
    const [locationError, setLocationError] = React.useState(null)

    // Track live location for tourists
    React.useEffect(() => {
        if (userType === 'tourist' && navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    setLiveLocation([latitude, longitude])
                    setCenter([latitude, longitude])
                    setLocationError(null)
                },
                (error) => {
                    setLocationError('Location access denied. Please enable location services.')
                    console.error('Geolocation error:', error)
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            )

            return () => navigator.geolocation.clearWatch(watchId)
        }
    }, [userType])

    // Fetch user-specific data
    React.useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user-specific data
                if (userType === 'tourist' && userId) {
                    // Fetch tourist's own profile
                    const profileRes = await api.get(`/tourist/profile/?user_id=${userId}`)
                    setTouristProfile(profileRes.data)
                } else if (userType === 'authority' && userId) {
                    // Fetch all tourists for authority dashboard
                    const touristsRes = await api.get('/authority/tourists/')
                    setAllTourists(touristsRes.data.tourists || [])
                    
                    // Fetch SOS alerts
                    const alertsRes = await api.get('/authority/sos-alerts/')
                    setSosAlerts(alertsRes.data.alerts || [])
                }
            } catch (err) {
                console.error('Error fetching user data:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchUserData()

        // Poll for new SOS alerts (authority only)
        if (userType === 'authority') {
            const interval = setInterval(() => {
                api.get('/authority/sos-alerts/')
                    .then(res => setSosAlerts(res.data.alerts || []))
                    .catch(err => console.error('Error fetching alerts:', err))
            }, 5000) // Poll every 5 seconds

            return () => clearInterval(interval)
        }
    }, [userId, userType])

    // Fetch nearby places from Overpass API when location changes
    React.useEffect(() => {
        const fetchPlaces = async () => {
            // Get user's current location (liveLocation for tourists, center as fallback)
            const userLocation = liveLocation || center
            
            // Don't fetch if we don't have a valid location
            if (!userLocation || !Array.isArray(userLocation) || userLocation.length !== 2) {
                return
            }
            
            setPlacesLoading(true)
            setPlacesError(null)
            
            try {
                const radius = 5000 // 5km radius in meters
                const [lat, lng] = userLocation
                
                // Fetch all place types in parallel
                const [hospitalsData, restaurantsData, attractionsData] = await Promise.all([
                    fetchNearbyPlacesFromOverpass(lat, lng, radius, 'hospital'),
                    fetchNearbyPlacesFromOverpass(lat, lng, radius, 'restaurant'),
                    fetchNearbyPlacesFromOverpass(lat, lng, radius, 'attraction')
                ])
                
                // Transform all elements to our format
                const allPlaces = [
                    ...hospitalsData.map(el => transformOverpassElement(el, 'hospital')).filter(Boolean),
                    ...restaurantsData.map(el => transformOverpassElement(el, 'restaurant')).filter(Boolean),
                    ...attractionsData.map(el => transformOverpassElement(el, 'attraction')).filter(Boolean)
                ]
                
                setMarkers(allPlaces)
                console.log(`Fetched ${allPlaces.length} places from Overpass API`)
            } catch (error) {
                console.error('Error fetching places from Overpass API:', error)
                setPlacesError('Failed to load nearby places. Please try again later.')
                setMarkers([])
            } finally {
                setPlacesLoading(false)
            }
        }
        
        // Debounce to avoid too many API calls
        const timeoutId = setTimeout(fetchPlaces, 500)
        return () => clearTimeout(timeoutId)
    }, [liveLocation, center])

    const handleSOS = async () => {
        if (!liveLocation) {
            alert('Please enable location services to send SOS')
            return
        }

        if (!confirm('Are you sure you want to send an SOS alert? This will notify authorities immediately.')) {
            return
        }

        setSosLoading(true)
        try {
            await api.post('/tourist/sos/', {
                user_id: userId,
                lat: liveLocation[0],
                lng: liveLocation[1],
                description: 'Emergency SOS Alert'
            })
            alert('SOS Alert sent! Authorities have been notified.')
        } catch (err) {
            console.error('SOS error:', err)
            alert('Failed to send SOS alert. Please try again.')
        } finally {
            setSosLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-xl font-semibold text-gray-700">Loading Dashboard...</div>
                </motion.div>
            </div>
        )
    }

    // Authority Dashboard - Show all tourists and SOS alerts
    if (userType === 'authority') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto"
                >
                    <div className="mb-6">
                        <h2 className="text-4xl font-bold text-gray-800 mb-2">Authority Dashboard</h2>
                        <p className="text-gray-600">Monitor all registered tourists and emergency alerts</p>
                    </div>

                    {/* SOS Alerts Section */}
                    {sosAlerts.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6"
                        >
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-2xl font-bold text-red-700 flex items-center gap-2">
                                        <span className="animate-pulse">🚨</span>
                                        Active SOS Alerts ({sosAlerts.length})
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {sosAlerts.map((alert) => (
                                        <motion.div
                                            key={alert.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="bg-white p-4 rounded-lg shadow-md border-2 border-red-300"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-bold text-red-700">{alert.tourist_name}</h4>
                                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                                    {new Date(alert.created_at).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                                            <p className="text-xs text-gray-500">
                                                Location: {alert.lat.toFixed(4)}, {alert.lng.toFixed(4)}
                                            </p>
                                            <a
                                                href={`https://www.google.com/maps?q=${alert.lat},${alert.lng}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                                            >
                                                View on Map →
                                            </a>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Map with SOS markers */}
                    <Card className="mb-6 p-0 overflow-hidden">
                        <div className="h-96">
                            <MapContainer center={center} zoom={13} className="h-full w-full">
                                <TileLayer
                                    attribution='&copy; OpenStreetMap contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {markers.map((m) => (
                                    <Marker key={m.id} position={[m.lat, m.lng]}>
                                        <Popup>
                                            <div className="text-sm">
                                                <strong>{m.name}</strong>
                                                <div>{m.place_type}</div>
                                                <div>{m.address}</div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                                {sosAlerts.map((alert) => (
                                    <Marker
                                        key={`sos-${alert.id}`}
                                        position={[alert.lat, alert.lng]}
                                        icon={sosIcon}
                                    >
                                        <Popup>
                                            <div className="text-sm">
                                                <strong className="text-red-600">🚨 SOS Alert</strong>
                                                <div><strong>{alert.tourist_name}</strong></div>
                                                <div>{alert.description}</div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(alert.created_at).toLocaleString()}
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    </Card>

                    {/* All Tourists List */}
                    <div className="mt-6">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                            All Registered Tourists ({allTourists.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {allTourists.map((tourist, index) => (
                                <motion.div
                                    key={tourist.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="p-4 hover:shadow-lg transition-shadow">
                                        <div className="space-y-2">
                                            {tourist.profile_photo && (
                                                <img
                                                    src={tourist.profile_photo}
                                                    alt={tourist.name}
                                                    className="w-full h-48 object-cover rounded-lg mb-2"
                                                />
                                            )}
                                            <h4 className="font-semibold text-lg">{tourist.name}</h4>
                                            <p className="text-sm text-gray-600">Email: {tourist.email}</p>
                                            <p className="text-sm text-gray-600">Phone: {tourist.phone || 'N/A'}</p>
                                            <p className="text-sm text-gray-600">Nationality: {tourist.nationality || 'N/A'}</p>
                                            <p className="text-sm text-gray-600">Current Location: {tourist.current_location || 'N/A'}</p>

                                            {tourist.from_address && (
                                                <div className="mt-2 pt-2 border-t">
                                                    <p className="text-xs font-semibold">Travel Details:</p>
                                                    <p className="text-xs text-gray-600">From: {tourist.from_address}</p>
                                                    {tourist.to_address && (
                                                        <p className="text-xs text-gray-600">To: {tourist.to_address}</p>
                                                    )}
                                                    {tourist.arrival_date && (
                                                        <p className="text-xs text-gray-600">Arrival: {new Date(tourist.arrival_date).toLocaleDateString()}</p>
                                                    )}
                                                    {tourist.departure_date && (
                                                        <p className="text-xs text-gray-600">Departure: {new Date(tourist.departure_date).toLocaleDateString()}</p>
                                                    )}
                                                    {tourist.hotel_name && (
                                                        <p className="text-xs text-gray-600">Hotel: {tourist.hotel_name}</p>
                                                    )}
                                                    {tourist.hotel_address && (
                                                        <p className="text-xs text-gray-600">Hotel Address: {tourist.hotel_address}</p>
                                                    )}
                                                </div>
                                            )}

                                            <p className="text-xs text-gray-400 mt-2">
                                                Registered: {new Date(tourist.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                        {allTourists.length === 0 && (
                            <p className="text-gray-500 text-center py-8">No tourists registered yet.</p>
                        )}
                    </div>
                </motion.div>
            </div>
        )
    }

    // Tourist Dashboard - Show own profile, live location map, and SOS button
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="max-w-7xl mx-auto p-4">
                {/* Header with SOS Button */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex items-center justify-between"
                >
                    <div>
                        <h2 className="text-4xl font-bold text-gray-800 mb-2">Your Dashboard</h2>
                        <p className="text-gray-600">Stay safe and track your location</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSOS}
                        disabled={sosLoading || !liveLocation}
                        className="px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 animate-pulse"
                    >
                        {sosLoading ? (
                            <>
                                <span className="animate-spin">⏳</span>
                                Sending...
                            </>
                        ) : (
                            <>
                                <span className="text-2xl">🚨</span>
                                SOS
                            </>
                        )}
                    </motion.button>
                </motion.div>

                {/* Location Status */}
                {locationError && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded"
                    >
                        <p className="text-yellow-800">{locationError}</p>
                    </motion.div>
                )}
                {liveLocation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-4 bg-green-50 border-l-4 border-green-400 p-4 rounded"
                    >
                        <p className="text-green-800 flex items-center gap-2">
                            <span className="animate-pulse">📍</span>
                            Live location tracking active
                        </p>
                    </motion.div>
                )}

                {/* Tourist Profile Summary */}
                {touristProfile && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <Card className="p-6 bg-white/80 backdrop-blur-sm">
                            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Your Profile</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-4">
                                    {touristProfile.profile_photo && (
                                        <img
                                            src={touristProfile.profile_photo}
                                            alt={touristProfile.name}
                                            className="w-32 h-32 object-cover rounded-full border-4 border-blue-200 shadow-lg"
                                        />
                                    )}
                                    <div className="space-y-2">
                                        <p className="text-lg"><strong className="text-gray-700">Name:</strong> {touristProfile.name}</p>
                                        <p><strong className="text-gray-700">Email:</strong> {touristProfile.email}</p>
                                        <p><strong className="text-gray-700">Phone:</strong> {touristProfile.phone || 'Not provided'}</p>
                                        <p><strong className="text-gray-700">Nationality:</strong> {touristProfile.nationality || 'Not provided'}</p>
                                        <p><strong className="text-gray-700">Current Location:</strong> {touristProfile.current_location || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div>
                                    {touristProfile.from_address && (
                                        <>
                                            <h4 className="font-semibold text-lg mb-3 text-gray-800">Travel Details</h4>
                                            <div className="space-y-2 text-gray-700">
                                                <p><strong>From:</strong> {touristProfile.from_address}</p>
                                                {touristProfile.to_address && (
                                                    <p><strong>To:</strong> {touristProfile.to_address}</p>
                                                )}
                                                {touristProfile.arrival_date && (
                                                    <p><strong>Arrival:</strong> {new Date(touristProfile.arrival_date).toLocaleDateString()}</p>
                                                )}
                                                {touristProfile.departure_date && (
                                                    <p><strong>Departure:</strong> {new Date(touristProfile.departure_date).toLocaleDateString()}</p>
                                                )}
                                                {touristProfile.hotel_name && (
                                                    <p><strong>Hotel:</strong> {touristProfile.hotel_name}</p>
                                                )}
                                                {touristProfile.hotel_address && (
                                                    <p><strong>Hotel Address:</strong> {touristProfile.hotel_address}</p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Live Location Map */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    <Card className="p-0 overflow-hidden shadow-xl">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <span>🗺️</span>
                                Live Location Map
                            </h3>
                        </div>
                        <div className="h-96">
                            <MapContainer center={center} zoom={15} className="h-full w-full">
                                <TileLayer
                                    attribution='&copy; OpenStreetMap contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <MapUpdater center={center} />
                                {liveLocation && (
                                    <Marker position={liveLocation}>
                                        <Popup>
                                            <div className="text-sm">
                                                <strong>📍 Your Current Location</strong>
                                                <div>Lat: {liveLocation[0].toFixed(6)}</div>
                                                <div>Lng: {liveLocation[1].toFixed(6)}</div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )}
                                {markers.map((m) => (
                                    <Marker key={m.id} position={[m.lat, m.lng]}>
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
                        </div>
                    </Card>
                </motion.div>

                {/* Nearby Places */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {(() => {
                        // Get user's current location (liveLocation for tourists, center as fallback)
                        const userLocation = liveLocation || center
                        
                        // Calculate distances and sort places by proximity
                        const getNearbyPlaces = (placeType, maxDistance = 50) => {
                            if (!markers || !Array.isArray(markers) || markers.length === 0) {
                                return []
                            }
                            
                            // Filter by exact place_type match (already set correctly from Overpass)
                            const filtered = markers.filter(m => {
                                if (!m.place_type) return false
                                return m.place_type.toLowerCase() === placeType.toLowerCase()
                            })
                            
                            if (filtered.length === 0) {
                                return []
                            }
                            
                            // Calculate distances for all matching places
                            const withDistance = filtered.map(m => {
                                try {
                                    return {
                                        ...m,
                                        distance: calculateDistance(
                                            userLocation[0],
                                            userLocation[1],
                                            parseFloat(m.lat),
                                            parseFloat(m.lng)
                                        )
                                    }
                                } catch (err) {
                                    console.error('Error calculating distance for place:', m, err)
                                    return { ...m, distance: Infinity }
                                }
                            }).filter(m => !isNaN(m.distance) && isFinite(m.distance))
                            
                            // Sort by distance (closest first)
                            const sorted = withDistance.sort((a, b) => a.distance - b.distance)
                            
                            // Filter by maxDistance, but if none within range, show closest ones anyway
                            const withinRange = sorted.filter(m => m.distance <= maxDistance)
                            
                            // Return places within range, or at least the closest 10 if none are within range
                            return (withinRange.length > 0 ? withinRange : sorted).slice(0, 10)
                        }

                        const nearbyHospitals = getNearbyPlaces('hospital')
                        const nearbyRestaurants = getNearbyPlaces('restaurant')
                        const nearbyAttractions = getNearbyPlaces('attraction')

                        return (
                            <div>
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                        <span>📍</span>
                                        Nearby Places
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        {placesLoading && (
                                            <span className="text-sm text-blue-600 flex items-center gap-1">
                                                <span className="animate-spin">⏳</span>
                                                Loading...
                                            </span>
                                        )}
                                        {liveLocation && !placesLoading && (
                                            <p className="text-sm text-gray-600">
                                                Showing places within 5km of your location
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {placesError && (
                                    <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                                        <p className="text-yellow-800 text-sm">{placesError}</p>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Hospitals */}
                                    <Card className="bg-gradient-to-br from-red-50 to-pink-50 hover:shadow-lg transition-shadow">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-semibold text-lg flex items-center gap-2">
                                                <span className="text-2xl">🏥</span>
                                                Nearby Hospitals
                                            </h4>
                                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                                                {nearbyHospitals.length}
                                            </span>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {nearbyHospitals.length > 0 ? (
                                                <ul className="space-y-3">
                                                    {nearbyHospitals.map((h) => (
                                                        <li key={h.id} className="pb-3 border-b border-gray-200 last:border-0">
                                                            <div className="flex items-start justify-between mb-1">
                                                                <strong className="text-gray-800 text-sm font-semibold flex-1">
                                                                    {h.name}
                                                                </strong>
                                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium ml-2 whitespace-nowrap">
                                                                    {h.distance < 1 
                                                                        ? `${(h.distance * 1000).toFixed(0)}m`
                                                                        : `${h.distance.toFixed(2)}km`
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="text-xs text-gray-600 mt-1 leading-relaxed">
                                                                {h.address}
                                                            </div>
                                                            <a
                                                                href={`https://www.google.com/maps?q=${h.lat},${h.lng}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-block"
                                                            >
                                                                View on Map →
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <p className="text-gray-500 text-sm">
                                                        {placesLoading
                                                            ? "Loading hospitals..."
                                                            : markers.length === 0
                                                                ? "No places data available"
                                                                : liveLocation 
                                                                    ? "No hospitals found nearby"
                                                                    : "Enable location to see nearby hospitals"
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </Card>

                                    {/* Restaurants */}
                                    <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 hover:shadow-lg transition-shadow">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-semibold text-lg flex items-center gap-2">
                                                <span className="text-2xl">🍽️</span>
                                                Nearby Restaurants
                                            </h4>
                                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
                                                {nearbyRestaurants.length}
                                            </span>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {nearbyRestaurants.length > 0 ? (
                                                <ul className="space-y-3">
                                                    {nearbyRestaurants.map((r) => (
                                                        <li key={r.id} className="pb-3 border-b border-gray-200 last:border-0">
                                                            <div className="flex items-start justify-between mb-1">
                                                                <strong className="text-gray-800 text-sm font-semibold flex-1">
                                                                    {r.name}
                                                                </strong>
                                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium ml-2 whitespace-nowrap">
                                                                    {r.distance < 1 
                                                                        ? `${(r.distance * 1000).toFixed(0)}m`
                                                                        : `${r.distance.toFixed(2)}km`
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="text-xs text-gray-600 mt-1 leading-relaxed">
                                                                {r.address}
                                                            </div>
                                                            <a
                                                                href={`https://www.google.com/maps?q=${r.lat},${r.lng}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-block"
                                                            >
                                                                View on Map →
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <p className="text-gray-500 text-sm">
                                                        {placesLoading
                                                            ? "Loading restaurants..."
                                                            : markers.length === 0
                                                                ? "No places data available"
                                                                : liveLocation 
                                                                    ? "No restaurants found nearby"
                                                                    : "Enable location to see nearby restaurants"
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </Card>

                                    {/* Attractions */}
                                    <Card className="bg-gradient-to-br from-green-50 to-teal-50 hover:shadow-lg transition-shadow">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-semibold text-lg flex items-center gap-2">
                                                <span className="text-2xl">🎯</span>
                                                Nearby Attractions
                                            </h4>
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                                                {nearbyAttractions.length}
                                            </span>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {nearbyAttractions.length > 0 ? (
                                                <ul className="space-y-3">
                                                    {nearbyAttractions.map((a) => (
                                                        <li key={a.id} className="pb-3 border-b border-gray-200 last:border-0">
                                                            <div className="flex items-start justify-between mb-1">
                                                                <strong className="text-gray-800 text-sm font-semibold flex-1">
                                                                    {a.name}
                                                                </strong>
                                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium ml-2 whitespace-nowrap">
                                                                    {a.distance < 1 
                                                                        ? `${(a.distance * 1000).toFixed(0)}m`
                                                                        : `${a.distance.toFixed(2)}km`
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="text-xs text-gray-600 mt-1 leading-relaxed">
                                                                {a.address}
                                                            </div>
                                                            <a
                                                                href={`https://www.google.com/maps?q=${a.lat},${a.lng}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-block"
                                                            >
                                                                View on Map →
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <p className="text-gray-500 text-sm">
                                                        {placesLoading
                                                            ? "Loading attractions..."
                                                            : markers.length === 0
                                                                ? "No places data available"
                                                                : liveLocation 
                                                                    ? "No attractions found nearby"
                                                                    : "Enable location to see nearby attractions"
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        )
                    })()}
                </motion.div>
            </div>
        </div>
    )
}
