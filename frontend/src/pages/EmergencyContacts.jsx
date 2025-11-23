import React from 'react'
import { motion } from 'framer-motion'
import Card from '../components/Card'
import api from '../api'

export default function EmergencyContacts() {
    const [contacts, setContacts] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const loadContacts = async () => {
            try {
                const res = await api.get('/profiles/')
                if (res.data.length) {
                    setContacts(res.data[0].contacts || [])
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        loadContacts()
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
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">Emergency Contacts</h2>
                    <p className="text-gray-600">Quick access to your emergency contacts</p>
                </motion.div>

                <Card className="shadow-lg">
                    {contacts.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📞</div>
                            <p className="text-gray-500 text-lg">
                                No contacts available. Add via API or Django Admin.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {contacts.map((c, index) => (
                                <motion.div
                                    key={c.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex-1">
                                            <div className="font-semibold text-lg text-gray-800 mb-1">
                                                {c.name}
                                            </div>
                                            <div className="text-sm text-gray-600 mb-1">
                                                {c.relation}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {c.phone}
                                            </div>
                                        </div>
                                        <motion.a
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            href={`tel:${c.phone}`}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
                                        >
                                            Call
                                        </motion.a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
