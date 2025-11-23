from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db import transaction
from django.shortcuts import render
import secrets

from .models import TouristProfile, Place, Incident, EmergencyContact, AuthorityProfile
from .serializers import (
    TouristProfileSerializer,
    PlaceSerializer,
    IncidentSerializer,
    EmergencyContactSerializer,
    AuthorityProfileSerializer
)


# ---------------------------
# Frontend View (Serve React App)
# ---------------------------
def index(request):
    """Serve the React frontend"""
    return render(request, "index.html")


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


# ---------------------------
# Authentication Views
# ---------------------------

@api_view(["POST"])
def tourist_register(request):
    """Register a new tourist user"""
    try:
        full_name = request.data.get("full_name")
        email = request.data.get("email")
        password = request.data.get("password")
        nationality = request.data.get("nationality", "")
        current_location = request.data.get("current_location", "")
        profile_photo = request.FILES.get("profile_photo")

        # Validation
        if not all([full_name, email, password]):
            return Response(
                {"error": "Full name, email, and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(password) < 8:
            return Response(
                {"error": "Password must be at least 8 characters"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=email).exists():
            return Response(
                {"error": "Email already registered"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if TouristProfile.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already registered"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not profile_photo:
            return Response(
                {"error": "Profile photo is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            # Create User
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=full_name.split()[0] if full_name else "",
                last_name=" ".join(full_name.split()[1:]) if len(full_name.split()) > 1 else ""
            )

            # Create TouristProfile
            profile = TouristProfile.objects.create(
                user=user,
                name=full_name,
                email=email,
                nationality=nationality,
                current_location=current_location,
                profile_photo=profile_photo
            )

        return Response(
            {
                "message": "Registration successful",
                "user_id": user.id,
                "profile_id": profile.id,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": profile.name
                }
            },
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
def tourist_login(request):
    """Login for tourist users"""
    try:
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Authenticate user
        user = authenticate(username=email, password=password)
        if not user:
            return Response(
                {"error": "Invalid email or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Check if user has a tourist profile
        try:
            profile = TouristProfile.objects.get(user=user)
        except TouristProfile.DoesNotExist:
            return Response(
                {"error": "User is not registered as a tourist"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Generate a simple token (in production, use JWT)
        token = secrets.token_urlsafe(32)
        # Store token in session or use a proper token system
        # For now, we'll return user info

        return Response(
            {
                "message": "Login successful",
                "token": token,
                "user_id": user.id,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": profile.name
                }
            },
            status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
def authority_register(request):
    """Register a new authority user (requires admin verification)"""
    try:
        full_name = request.data.get("full_name")
        official_email = request.data.get("official_email")
        password = request.data.get("password")
        agency_type = request.data.get("agency_type")
        agency_name = request.data.get("agency_name")
        authority_id = request.data.get("authority_id")

        # Validation
        if not all([full_name, official_email, password, agency_type, agency_name, authority_id]):
            return Response(
                {"error": "All fields are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(password) < 8:
            return Response(
                {"error": "Password must be at least 8 characters"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=official_email).exists():
            return Response(
                {"error": "Email already registered"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if AuthorityProfile.objects.filter(official_email=official_email).exists():
            return Response(
                {"error": "Email already registered"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if AuthorityProfile.objects.filter(authority_id=authority_id).exists():
            return Response(
                {"error": "Authority ID already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            # Create User
            user = User.objects.create_user(
                username=official_email,
                email=official_email,
                password=password,
                first_name=full_name.split()[0] if full_name else "",
                last_name=" ".join(full_name.split()[1:]) if len(full_name.split()) > 1 else "",
                is_active=False  # Inactive until verified
            )

            # Create AuthorityProfile (not verified by default)
            profile = AuthorityProfile.objects.create(
                user=user,
                full_name=full_name,
                official_email=official_email,
                agency_type=agency_type,
                agency_name=agency_name,
                authority_id=authority_id,
                is_verified=False
            )

        return Response(
            {
                "message": "Access request submitted. Your details will be verified by an administrator shortly.",
                "user_id": user.id,
                "profile_id": profile.id,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": profile.full_name
                }
            },
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
def authority_login(request):
    """Login for authority users"""
    try:
        official_email = request.data.get("official_email")
        password = request.data.get("password")

        if not official_email or not password:
            return Response(
                {"error": "Official email and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Authenticate user
        user = authenticate(username=official_email, password=password)
        if not user:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Check if user has an authority profile
        try:
            profile = AuthorityProfile.objects.get(user=user)
        except AuthorityProfile.DoesNotExist:
            return Response(
                {"error": "User is not registered as an authority"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Check if verified
        if not profile.is_verified:
            return Response(
                {"error": "Your account is pending verification by an administrator"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Check if user is active
        if not user.is_active:
            return Response(
                {"error": "Your account is inactive. Please contact administrator"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Generate token
        token = secrets.token_urlsafe(32)

        return Response(
            {
                "message": "Login successful",
                "token": token,
                "user_id": user.id,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": profile.full_name,
                    "agency": profile.agency_name
                }
            },
            status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET", "PUT"])
def tourist_profile_detail(request):
    """Get or update tourist profile details"""
    try:
        # Get user from token or session (simplified - in production use proper auth)
        user_id = request.data.get("user_id") or request.query_params.get("user_id")
        if not user_id:
            return Response(
                {"error": "User ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
            profile = TouristProfile.objects.get(user=user)
        except (User.DoesNotExist, TouristProfile.DoesNotExist):
            return Response(
                {"error": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if request.method == "GET":
            serializer = TouristProfileSerializer(profile, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == "PUT":
            # Update profile
            profile.name = request.data.get("full_name", profile.name)
            profile.email = request.data.get("email", profile.email)
            profile.phone = request.data.get("phone_number", profile.phone)
            profile.from_address = request.data.get("from_address", profile.from_address)
            profile.to_address = request.data.get("to_address", profile.to_address)
            profile.arrival_date = request.data.get("arrival_date", profile.arrival_date)
            profile.departure_date = request.data.get("departure_date", profile.departure_date)
            profile.hotel_name = request.data.get("hotel_name", profile.hotel_name)
            profile.hotel_address = request.data.get("hotel_address", profile.hotel_address)

            # Handle password update
            if request.data.get("password"):
                if request.data.get("password") != request.data.get("confirm_password"):
                    return Response(
                        {"error": "Passwords do not match"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                user.set_password(request.data.get("password"))
                user.save()

            # Handle profile photo update
            if request.FILES.get("profile_photo"):
                profile.profile_photo = request.FILES.get("profile_photo")

            profile.save()
            serializer = TouristProfileSerializer(profile, context={'request': request})
            return Response(
                {"message": "Profile updated successfully", "profile": serializer.data},
                status=status.HTTP_200_OK
            )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET", "PUT"])
def authority_profile_detail(request):
    """Get or update authority profile details"""
    try:
        user_id = request.data.get("user_id") or request.query_params.get("user_id")
        if not user_id:
            return Response(
                {"error": "User ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
            profile = AuthorityProfile.objects.get(user=user)
        except (User.DoesNotExist, AuthorityProfile.DoesNotExist):
            return Response(
                {"error": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if request.method == "GET":
            serializer = AuthorityProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == "PUT":
            # Update profile
            profile.full_name = request.data.get("full_name", profile.full_name)
            profile.official_email = request.data.get("official_email", profile.official_email)
            profile.phone = request.data.get("phone_number", profile.phone)
            profile.authority_id = request.data.get("officer_id", profile.authority_id)

            # Handle password update
            if request.data.get("password"):
                if request.data.get("password") != request.data.get("confirm_password"):
                    return Response(
                        {"error": "Passwords do not match"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                user.set_password(request.data.get("password"))
                user.save()

            profile.save()
            serializer = AuthorityProfileSerializer(profile)
            return Response(
                {"message": "Profile updated successfully", "profile": serializer.data},
                status=status.HTTP_200_OK
            )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
def get_tourist_profile(request):
    """Get tourist's own profile after login"""
    try:
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response(
                {"error": "User ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
            profile = TouristProfile.objects.get(user=user)
        except (User.DoesNotExist, TouristProfile.DoesNotExist):
            return Response(
                {"error": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = TouristProfileSerializer(profile, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
def get_all_tourists(request):
    """Get all tourist profiles (for authority dashboard)"""
    try:
        # Get all tourist profiles with all details
        tourists = TouristProfile.objects.all().order_by('-created_at')
        serializer = TouristProfileSerializer(tourists, many=True, context={'request': request})
        return Response(
            {
                "count": tourists.count(),
                "tourists": serializer.data
            },
            status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
def get_tourist_by_id(request, tourist_id):
    """Get a specific tourist profile by ID (for authority dashboard)"""
    try:
        try:
            profile = TouristProfile.objects.get(id=tourist_id)
        except TouristProfile.DoesNotExist:
            return Response(
                {"error": "Tourist profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = TouristProfileSerializer(profile, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
def create_sos_alert(request):
    """Create an SOS alert from tourist"""
    try:
        user_id = request.data.get("user_id")
        lat = request.data.get("lat")
        lng = request.data.get("lng")
        description = request.data.get("description", "Emergency SOS Alert")

        if not all([user_id, lat, lng]):
            return Response(
                {"error": "User ID, latitude, and longitude are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
            profile = TouristProfile.objects.get(user=user)
        except (User.DoesNotExist, TouristProfile.DoesNotExist):
            return Response(
                {"error": "Tourist profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Create incident/alert
        incident = Incident.objects.create(
            profile=profile,
            title="SOS Alert",
            description=description,
            lat=float(lat),
            lng=float(lng),
            resolved=False
        )

        return Response(
            {
                "message": "SOS alert sent successfully",
                "alert_id": incident.id,
                "created_at": incident.created_at
            },
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
def get_sos_alerts(request):
    """Get all active SOS alerts for authority dashboard"""
    try:
        # Get all unresolved incidents (SOS alerts)
        alerts = Incident.objects.filter(resolved=False).order_by('-created_at')
        
        alerts_data = []
        for alert in alerts:
            alerts_data.append({
                "id": alert.id,
                "tourist_name": alert.profile.name,
                "tourist_email": alert.profile.email,
                "tourist_phone": alert.profile.phone,
                "description": alert.description,
                "lat": alert.lat,
                "lng": alert.lng,
                "created_at": alert.created_at,
                "resolved": alert.resolved
            })

        return Response(
            {
                "count": len(alerts_data),
                "alerts": alerts_data
            },
            status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
