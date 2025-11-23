#!/usr/bin/env python
"""Create a Django superuser if it doesn't exist"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User

username = 'admin'
email = 'admin@example.com'
password = 'admin123'  # Change this in production!

if User.objects.filter(username=username).exists():
    print(f'Superuser "{username}" already exists.')
else:
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f'Superuser "{username}" created successfully!')
    print(f'Username: {username}')
    print(f'Password: {password}')
    print('\n⚠️  IMPORTANT: Change the password in production!')

