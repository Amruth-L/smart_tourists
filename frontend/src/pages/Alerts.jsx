import React from 'react'
import { motion } from 'framer-motion'
import Card from '../components/Card'
import api from '../api'

export default function Alerts() {
    const [incidents, setIncidents] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/incidents/')
                setIncidents(res.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">Alerts & Incidents</h2>
                    <p className="text-gray-600">Stay informed about safety alerts in your area</p>
                </motion.div>

                <div className="space-y-4">
                    {incidents.length === 0 ? (
                        <Card className="text-center py-12">
                            <div className="text-6xl mb-4">🔔</div>
                            <p className="text-gray-500 text-lg">No incidents reported yet.</p>
                        </Card>
                    ) : (
                        incidents.map((incident, index) => (
                            <motion.div
                                key={incident.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="font-semibold text-xl text-gray-800 mb-2">
                                                {incident.title}
                                            </div>
                                            <div className="text-gray-600 mb-2">
                                                {incident.description}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(incident.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                        <motion.a
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            href={`https://www.google.com/maps/search/?api=1&query=${incident.lat},${incident.lng}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md ml-4"
                                        >
                                            View Map
                                        </motion.a>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
