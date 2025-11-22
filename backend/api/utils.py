from math import radians, cos, sin, asin, sqrt


def is_inside_geofence(point_lat, point_lng, center_lat, center_lng, radius_meters):
    """Simple Haversine distance check."""
    lat1, lon1, lat2, lon2 = map(
        radians, [point_lat, point_lng, center_lat, center_lng]
    )

    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))
    R = 6371000  # earth radius meters
    distance = R * c

    return distance <= radius_meters


def mock_reverse_geocode(lat, lng):
    """Fake address only for demo."""
    return {
        'address': f'Address at {lat:.5f}, {lng:.5f}',
        'city': 'Demo City',
        'country': 'Demo Country'
    }
