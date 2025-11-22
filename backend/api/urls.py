from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TouristProfileViewSet,
    PlaceViewSet,
    IncidentViewSet,
    EmergencyContactViewSet,
    geofence_check
)

router = DefaultRouter()
router.register("profiles", TouristProfileViewSet)
router.register("places", PlaceViewSet)
router.register("incidents", IncidentViewSet)
router.register("contacts", EmergencyContactViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("geofence/", geofence_check),
]
