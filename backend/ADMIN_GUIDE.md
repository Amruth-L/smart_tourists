# Django Admin Panel Guide

## 🔐 Access Django Admin

**URL:** http://127.0.0.1:8000/admin/

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **IMPORTANT:** Change the password after first login!

## 📊 View Database Records

### Tourist Profiles
- View all registered tourists
- See their personal information, travel details, and profile photos
- Search by name, email, or nationality
- Filter by nationality or registration date

### Authority Profiles
- View all authority registrations
- Verify authority accounts (makes them active)
- Search by name, email, agency name, or authority ID
- Filter by agency type or verification status

### Other Models
- **Emergency Contacts** - Tourist emergency contacts
- **Places** - Hospitals, restaurants, attractions
- **Incidents** - Tourist incident reports

## 🔧 Admin Actions

### Verify Authority Accounts
1. Go to Authority Profiles
2. Select the authorities you want to verify
3. Choose "Verify selected authorities" from the Actions dropdown
4. Click "Go"

This will:
- Set `is_verified = True`
- Activate the user account (`is_active = True`)

## 🛠️ Create New Admin User

If you need to create another admin user:

```bash
cd backend
source .venv/bin/activate
python manage.py createsuperuser
```

Or use the script:
```bash
python create_admin.py
```

## 📝 Notes

- All models are registered in the admin panel
- You can add, edit, and delete records
- Profile photos are displayed in the admin
- Use filters and search to find specific records

