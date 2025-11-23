import React from 'react'
import { motion } from 'framer-motion'
import Card from '../components/Card'
import api from '../api'

export default function TouristID() {
    const [profile, setProfile] = React.useState(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/profiles/')
                if (res.data.length) setProfile(res.data[0])
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
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">My Tourist ID</h2>
                    <p className="text-gray-600">Your digital identification card</p>
                </motion.div>

                <Card className="shadow-xl">
                    {profile ? (
                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                {profile.profile_photo && (
                                    <img
                                        src={profile.profile_photo}
                                        alt={profile.name}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
                                    />
                                )}
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                        {profile.name}
                                    </h3>
                                    <p className="text-gray-600 mb-1">{profile.email}</p>
                                    <p className="text-gray-600">{profile.phone}</p>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-gray-200">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                        Blockchain ID:
                                    </p>
                                    <code className="bg-white px-4 py-2 rounded-lg text-blue-600 font-mono text-sm border border-blue-200">
                                        {profile.blockchain_id || 'Not set'}
                                    </code>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🆔</div>
                            <p className="text-gray-500 text-lg">
                                No profile found. Create one via API or admin.
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
