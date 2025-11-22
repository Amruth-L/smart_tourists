from rest_framework import serializers
from .models import TouristProfile, EmergencyContact, Place, Incident


class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = ['id', 'name', 'relation', 'phone']


class TouristProfileSerializer(serializers.ModelSerializer):
    contacts = EmergencyContactSerializer(many=True, read_only=True)

    class Meta:
        model = TouristProfile
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'country',
            'blockchain_id',
            'contacts'
        ]


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
