from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User

from .models import TouristProfile, Place, Incident, EmergencyContact
from .serializers import (
    TouristProfileSerializer,
    PlaceSerializer,
    IncidentSerializer,
    EmergencyContactSerializer
)


# ---------------------------
# TouristProfile ViewSet
# ---------------------------
class TouristProfileViewSet(viewsets.ModelViewSet):
    queryset = TouristProfile.objects.all()
    serializer_class = TouristProfileSerializer


# ---------------------------
# Emergency Contacts
# ---------------------------
class EmergencyContactViewSet(viewsets.ModelViewSet):
    queryset = EmergencyContact.objects.all()
    serializer_class = EmergencyContactSerializer


# ---------------------------
# Places ViewSet
# ---------------------------
class PlaceViewSet(viewsets.ModelViewSet):
    queryset = Place.objects.all()
    serializer_class = PlaceSerializer


# ---------------------------
# Incident ViewSet
# ---------------------------
class IncidentViewSet(viewsets.ModelViewSet):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer


# ---------------------------
# Simple geofence check API
# ---------------------------
@api_view(["POST"])
def geofence_check(request):
    try:
        lat = float(request.data.get("lat"))
        lng = float(request.data.get("lng"))
        radius = float(request.data.get("radius", 0.01))

        places = Place.objects.filter(
            lat__range=(lat - radius, lat + radius),
            lng__range=(lng - radius, lng + radius),
        )

        serializer = PlaceSerializer(places, many=True)
        return Response({"nearby_places": serializer.data}, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=400)
