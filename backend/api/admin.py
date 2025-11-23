from django.contrib import admin
from .models import TouristProfile, EmergencyContact, Place, Incident, AuthorityProfile


@admin.register(TouristProfile)
class TouristProfileAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'nationality', 'current_location', 'created_at']
    search_fields = ['name', 'email', 'nationality']
    list_filter = ['nationality', 'created_at']


@admin.register(AuthorityProfile)
class AuthorityProfileAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'official_email', 'agency_type', 'agency_name', 'is_verified', 'created_at']
    search_fields = ['full_name', 'official_email', 'agency_name', 'authority_id']
    list_filter = ['agency_type', 'is_verified', 'created_at']
    actions = ['verify_authorities']

    def verify_authorities(self, request, queryset):
        queryset.update(is_verified=True)
        for profile in queryset:
            if profile.user:
                profile.user.is_active = True
                profile.user.save()
        self.message_user(request, f"{queryset.count()} authority profiles verified.")
    verify_authorities.short_description = "Verify selected authorities"


admin.site.register(EmergencyContact)
admin.site.register(Place)
admin.site.register(Incident)