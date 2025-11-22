import React from 'react'
import Card from '../components/Card'
import MapSection from '../components/MapSection'
import api from '../api'

export default function Dashboard() {
    const [markers, setMarkers] = React.useState([])
    const [center, setCenter] = React.useState([12.9716, 77.5946])

    React.useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const res = await api.get('/places/')
                setMarkers(res.data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchPlaces()
    }, [])

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

            <Card>
                <MapSection center={center} markers={markers} />
            </Card>

            {/* 3-Column Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

                {/* Hospitals */}
                <Card>
                    <h4 className="font-semibold">Nearby Hospitals</h4>
                    <ul className="text-sm mt-2">
                        {markers
                            .filter(m => m.place_type === 'hospital')
                            .slice(0, 5)
                            .map(h => (
                                <li key={h.id} className="py-1">
                                    {h.name} — {h.address}
                                </li>
                            ))}
                    </ul>
                </Card>

                {/* Restaurants */}
                <Card>
                    <h4 className="font-semibold">Restaurants</h4>
                    <ul className="text-sm mt-2">
                        {markers
                            .filter(m => m.place_type === 'restaurant')
                            .slice(0, 5)
                            .map(r => (
                                <li key={r.id} className="py-1">
                                    {r.name} — {r.address}
                                </li>
                            ))}
                    </ul>
                </Card>

                {/* Attractions */}
                <Card>
                    <h4 className="font-semibold">Attractions</h4>
                    <ul className="text-sm mt-2">
                        {markers
                            .filter(m => m.place_type === 'attraction')
                            .slice(0, 5)
                            .map(a => (
                                <li key={a.id} className="py-1">
                                    {a.name} — {a.address}
                                </li>
                            ))}
                    </ul>
                </Card>

            </div>
        </div>
    )
}
