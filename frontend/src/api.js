import axios from 'axios'


// Use environment variable if set, otherwise:
// - In dev mode (Vite): use full URL to Django backend
// - In production (Django): use relative path
const API_BASE = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV 
    ? 'http://127.0.0.1:8000/api'  // Dev mode - full URL
    : '/api'                        // Production - relative path
)
const api = axios.create({ baseURL: API_BASE })


export default api