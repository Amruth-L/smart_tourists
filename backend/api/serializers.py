from rest_framework import serializers
from .models import TouristProfile, EmergencyContact, Place, Incident, AuthorityProfile


class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = ['id', 'name', 'relation', 'phone']


class TouristProfileSerializer(serializers.ModelSerializer):
    contacts = EmergencyContactSerializer(many=True, read_only=True)
    profile_photo = serializers.SerializerMethodField()

    class Meta:
        model = TouristProfile
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'country',
            'nationality',
            'current_location',
            'profile_photo',
            'blockchain_id',
            'from_address',
            'to_address',
            'arrival_date',
            'departure_date',
            'hotel_name',
            'hotel_address',
            'contacts',
            'created_at',
            'updated_at'
        ]

    def get_profile_photo(self, obj):
        if obj.profile_photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_photo.url)
            return obj.profile_photo.url
        return None


class PlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Place
        fields = [
            'id',
            'name',
            'place_type',
            'description',
            'lat',
            'lng',
            'address'
        ]


class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = [
            'id',
            'profile',
            'title',
            'description',
            'created_at',
            'lat',
            'lng',
            'evidence',
            'resolved'
        ]


class AuthorityProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthorityProfile
        fields = [
            'id',
            'full_name',
            'official_email',
            'phone',
            'agency_type',
            'agency_name',
            'authority_id',
            'is_verified',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['is_verified', 'created_at', 'updated_at']
