import React from 'react'
import Card from '../components/Card'
import api from '../api'


export default function TouristID() {
const [profile, setProfile] = React.useState(null)


React.useEffect(() => {
const fetch = async () => {
try {
const res = await api.get('/profiles/')
if (res.data.length) setProfile(res.data[0])
} catch (err) { console.error(err) }
}
fetch()
}, [])


return (
<div>
<h2 className="text-2xl font-semibold mb-4">My Tourist ID</h2>
<Card>
{profile ? (
<div>
<div className="text-lg font-semibold">{profile.name}</div>
<div className="text-sm text-slate-600">{profile.email} — {profile.phone}</div>
<div className="mt-3">Blockchain ID: <code className="bg-slate-100 px-2 py-1 rounded">{profile.blockchain_id || 'Not set'}</code></div>
</div>
) : (
<p className="text-sm text-slate-500">No profile found. Create one via API or admin.</p>
)}
</Card>
</div>
)
}