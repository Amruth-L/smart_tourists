import React from 'react'
import api from '../api'


export default function PanicButton({ profileId = 1, onSuccess = () => {} }) {
const [loading, setLoading] = React.useState(false)


const handlePanic = async () => {
if (!navigator.geolocation) {
alert('Geolocation not supported by your browser')
return
}


setLoading(true)
navigator.geolocation.getCurrentPosition(async (pos) => {
try {
const data = {
profile: profileId,
title: 'Panic Alert',
lat: pos.coords.latitude,
lng: pos.coords.longitude,
}
const res = await api.post('/incidents/panic/', data)
onSuccess(res.data)
alert('Panic alert sent successfully')
} catch (err) {
console.error(err)
alert('Failed to send panic alert')
} finally {
setLoading(false)
}
}, (err) => {
setLoading(false)
alert('Unable to get location: ' + (err.message || ''))
})
}


return (
<button
onClick={handlePanic}
className="px-6 py-3 bg-red-600 text-white rounded shadow hover:bg-red-700"
disabled={loading}
>
{loading ? 'Sending...' : 'PANIC'}
</button>
)
}