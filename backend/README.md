# Smart Tourist Safety — Backend (Django REST API)


## Setup (Linux / macOS / WSL)


1. Create virtualenv and activate it:


```bash
python -m venv venv
source venv/bin/activate
```


2. Install requirements:


```bash
pip install -r requirements.txt
```


3. Copy .env.sample to .env and edit SECRET_KEY if you want.


4. Run migrations and start the server:


```bash
python manage.py migrate
python manage.py runserver 8000
```


5. API root is at `http://127.0.0.1:8000/api/`




## Notes
- Uses SQLite for simplicity.
- CORS enabled for all origins (development). Adjust in `settings.py` for production.