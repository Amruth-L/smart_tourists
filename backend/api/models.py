from django.db import models
from django.contrib.auth.models import User


# -----------------------------------------
# Constants
# -----------------------------------------
PLACE_TYPES = (
    ('hospital', 'Hospital'),
    ('restaurant', 'Restaurant'),
    ('attraction', 'Attraction'),
)


# -----------------------------------------
# Tourist Profile
# -----------------------------------------
class TouristProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30, blank=True)
    country = models.CharField(max_length=100, blank=True)
    nationality = models.CharField(max_length=100, blank=True)
    current_location = models.CharField(max_length=200, blank=True)
    profile_photo = models.ImageField(upload_to='tourist_photos/', blank=True, null=True)
    blockchain_id = models.CharField(max_length=200, blank=True)
    # Travel Details
    from_address = models.TextField(blank=True)  # Origin
    to_address = models.TextField(blank=True)  # Destination
    arrival_date = models.DateField(null=True, blank=True)
    departure_date = models.DateField(null=True, blank=True)
    hotel_name = models.CharField(max_length=200, blank=True)
    hotel_address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


# -----------------------------------------
# Emergency Contacts
# -----------------------------------------
class EmergencyContact(models.Model):
    profile = models.ForeignKey(
        TouristProfile,
        on_delete=models.CASCADE,
        related_name='contacts'
    )
    name = models.CharField(max_length=200)
    relation = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} ({self.phone})"


# -----------------------------------------
# Places (Hospitals, Restaurants, etc.)
# -----------------------------------------
class Place(models.Model):
    name = models.CharField(max_length=255)
    place_type = models.CharField(max_length=50, choices=PLACE_TYPES)
    description = models.TextField(blank=True)
    lat = models.FloatField()
    lng = models.FloatField()
    address = models.CharField(max_length=500, blank=True)

    def __str__(self):
        return f"{self.name} - {self.place_type}"


# -----------------------------------------
# Incident Reports
# -----------------------------------------
class Incident(models.Model):
    profile = models.ForeignKey(
        TouristProfile,
        on_delete=models.CASCADE,
        related_name='incidents'
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    lat = models.FloatField()
    lng = models.FloatField()
    evidence = models.TextField(blank=True)  # store links, JSON, etc.
    resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} @ {self.created_at.strftime('%Y-%m-%d %H:%M')}"


# -----------------------------------------
# Authority Profile
# -----------------------------------------
AGENCY_TYPES = (
    ('police', 'Police'),
    ('hospital', 'Hospital/Medical'),
    ('embassy', 'Embassy'),
    ('fire', 'Fire Department'),
    ('tourism', 'Tourism Authority'),
    ('emergency', 'Emergency Services'),
    ('other', 'Other'),
)


class AuthorityProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    full_name = models.CharField(max_length=200)
    official_email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30, blank=True)  # Official phone number
    agency_type = models.CharField(max_length=50, choices=AGENCY_TYPES)
    agency_name = models.CharField(max_length=200)
    authority_id = models.CharField(max_length=100, unique=True)  # Badge number / Officer ID
    is_verified = models.BooleanField(default=False)  # Admin verification required
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} - {self.agency_name}"
