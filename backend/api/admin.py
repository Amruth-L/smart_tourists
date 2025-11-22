from django.contrib import admin
from .models import TouristProfile, EmergencyContact, Place, Incident


admin.site.register(TouristProfile)
admin.site.register(EmergencyContact)
admin.site.register(Place)
admin.site.register(Incident)