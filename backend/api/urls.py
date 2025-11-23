from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TouristProfileViewSet,
    PlaceViewSet,
    IncidentViewSet,
    EmergencyContactViewSet,
    geofence_check,
    tourist_register,
    tourist_login,
    authority_register,
    authority_login,
    tourist_profile_detail,
    authority_profile_detail,
    get_tourist_profile,
    get_all_tourists,
    get_tourist_by_id,
    create_sos_alert,
    get_sos_alerts
)

router = DefaultRouter()
router.register("profiles", TouristProfileViewSet)
router.register("places", PlaceViewSet)
router.register("incidents", IncidentViewSet)
router.register("contacts", EmergencyContactViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("geofence/", geofence_check),
    # Authentication endpoints
    path("auth/tourist/register/", tourist_register, name="tourist_register"),
    path("auth/tourist/login/", tourist_login, name="tourist_login"),
    path("auth/authority/register/", authority_register, name="authority_register"),
    path("auth/authority/login/", authority_login, name="authority_login"),
    # Profile detail endpoints
    path("profile/tourist/", tourist_profile_detail, name="tourist_profile_detail"),
    path("profile/authority/", authority_profile_detail, name="authority_profile_detail"),
    # Tourist profile endpoints
    path("tourist/profile/", get_tourist_profile, name="get_tourist_profile"),
    # Authority dashboard endpoints
    path("authority/tourists/", get_all_tourists, name="get_all_tourists"),
    path("authority/tourists/<int:tourist_id>/", get_tourist_by_id, name="get_tourist_by_id"),
    path("authority/sos-alerts/", get_sos_alerts, name="get_sos_alerts"),
    # Tourist SOS endpoint
    path("tourist/sos/", create_sos_alert, name="create_sos_alert"),
]
