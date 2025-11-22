import React from 'react'
import Card from '../components/Card'
import api from '../api'


export default function Alerts() {
const [incidents, setIncidents] = React.useState([])


React.useEffect(() => {
const fetch = async () => {
try {
const res = await api.get('/incidents/')
setIncidents(res.data)
} catch (err) { console.error(err) }
}
fetch()
}, [])


return (
<div>
<h2 className="text-2xl font-semibold mb-4">Alerts & Incidents</h2>
<div className="grid gap-4">
{incidents.length === 0 ? (
<Card>No incidents yet.</Card>
) : (
incidents.map(i => (
<Card key={i.id} className="flex justify-between items-center">
<div>
<div className="font-medium">{i.title}</div>
<div className="text-sm text-slate-600">{i.description}</div>
<div className="text-xs text-slate-400">{new Date(i.created_at).toLocaleString()}</div>
</div>
<div>
<a href={`https://www.google.com/maps/search/?api=1&query=${i.lat},${i.lng}`} target="_blank" rel="noreferrer" className="text-indigo-600">Open</a>
</div>
</Card>
))
)}
</div>
</div>
)
}