# Smart Tourist Safety Portal - Frontend

**React + Vite Frontend Application**

## 🚀 Quick Start

### Development Mode (with Vite dev server)

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: **http://localhost:5173/**

**Note:** Make sure the Django backend is running on `http://127.0.0.1:8000/` for API calls to work.

### Production Build (for Django)

```bash
cd frontend
npm install
npm run build
```

This builds the frontend to `../backend/static/` which Django serves.

## 📋 Available Scripts

- `npm run dev` - Start Vite development server (port 5173)
- `npm run build` - Build for production (outputs to `backend/static/`)
- `npm run preview` - Preview production build

## 🔧 Configuration

### Vite Config
- **Dev mode**: Base path is `/` (root)
- **Production build**: Base path is `/static/` (for Django serving)
- **API Proxy**: In dev mode, `/api` requests are proxied to `http://127.0.0.1:8000/api`

### API Configuration
- **Dev mode**: Uses `http://127.0.0.1:8000/api` (full URL)
- **Production**: Uses `/api` (relative path when served by Django)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   ├── api.js          # API configuration
│   └── index.css       # Global styles
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies
```

## 🐛 Troubleshooting

**Port 5173 already in use:**
- Vite will automatically try the next available port (5174, 5175, etc.)

**API calls failing in dev mode:**
- Make sure Django backend is running on port 8000
- Check browser console for CORS errors
- Verify `vite.config.js` has the proxy configuration

**Build errors:**
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## 📝 Notes

- Frontend uses Tailwind CSS for styling
- Uses Framer Motion for animations
- React Router is handled via state in App.jsx
- API calls use Axios
