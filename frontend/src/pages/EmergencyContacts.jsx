import React from 'react'
import Card from '../components/Card'
import api from '../api'

export default function EmergencyContacts() {
    const [contacts, setContacts] = React.useState([])

    React.useEffect(() => {
        const loadContacts = async () => {
            try {
                const res = await api.get('/profiles/')
                // take first profile's contacts
                if (res.data.length) {
                    setContacts(res.data[0].contacts || [])
                }
            } catch (err) {
                console.error(err)
            }
        }

        loadContacts()
    }, [])

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Emergency Contacts</h2>

            <Card>
                {contacts.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        No contacts available. Add via API or Django Admin.
                    </p>
                ) : (
                    <ul>
                        {contacts.map(c => (
                            <li
                                key={c.id}
                                className="py-2 flex justify-between items-center border-b last:border-none"
                            >
                                <div>
                                    <div className="font-medium">{c.name}</div>
                                    <div className="text-sm text-slate-600">
                                        {c.relation} — {c.phone}
                                    </div>
                                </div>
                                <a href={`tel:${c.phone}`} className="text-indigo-600">
                                    Call
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    )
}
