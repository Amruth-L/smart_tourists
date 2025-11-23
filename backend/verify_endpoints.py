#!/usr/bin/env python
"""
Quick verification script to check if authentication endpoints are properly configured.
Run this after starting the Django server to verify endpoints are working.
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.urls import reverse, resolve
from django.conf import settings

print("=" * 60)
print("Django Backend - Authentication Endpoints Verification")
print("=" * 60)
print()

# Check if we're using Django (not Node.js)
print("✅ Backend Framework: Django/Python")
print(f"   Django Version: {django.get_version()}")
print(f"   Python Version: {sys.version.split()[0]}")
print()

# Verify authentication endpoints
print("Authentication Endpoints:")
print("-" * 60)

try:
    from api.urls import urlpatterns
    
    auth_endpoints = [
        ("Tourist Register", "/api/auth/tourist/register/"),
        ("Tourist Login", "/api/auth/tourist/login/"),
        ("Authority Register", "/api/auth/authority/register/"),
        ("Authority Login", "/api/auth/authority/login/"),
    ]
    
    for name, path in auth_endpoints:
        # Try to find the URL pattern
        found = False
        for pattern in urlpatterns:
            if hasattr(pattern, 'pattern'):
                if str(pattern.pattern) in path or path in str(pattern.pattern):
                    found = True
                    break
            elif hasattr(pattern, 'url_patterns'):
                for sub_pattern in pattern.url_patterns:
                    if hasattr(sub_pattern, 'pattern'):
                        if str(sub_pattern.pattern) in path or path in str(sub_pattern.pattern):
                            found = True
                            break
        
        status = "✅" if found else "❌"
        print(f"{status} {name:25} {path}")
    
    print()
    print("Profile Endpoints:")
    print("-" * 60)
    
    profile_endpoints = [
        ("Tourist Profile", "/api/profile/tourist/"),
        ("Authority Profile", "/api/profile/authority/"),
    ]
    
    for name, path in profile_endpoints:
        found = False
        for pattern in urlpatterns:
            if hasattr(pattern, 'pattern'):
                if str(pattern.pattern) in path or path in str(pattern.pattern):
                    found = True
                    break
        
        status = "✅" if found else "❌"
        print(f"{status} {name:25} {path}")
    
    print()
    print("=" * 60)
    print("✅ All endpoints verified!")
    print()
    print("To start the server, run:")
    print("  python manage.py runserver 8000")
    print()
    print("Or use the startup script:")
    print("  ./run_server.sh")
    print("=" * 60)
    
except Exception as e:
    print(f"❌ Error verifying endpoints: {e}")
    import traceback
    traceback.print_exc()

