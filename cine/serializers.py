from rest_framework import serializers
from .models import Show, Reservation

class ShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Show
        fields = ["id", "movie_title", "room", "price", "available_seats"]

class ReservationSerializer(serializers.ModelSerializer):
    showid_nombre = serializers.CharField(source="show_id.movie_title", read_only=True)

    class Meta:
        model = Reservation
        fields = ["id", "show_id","showid_nombre", "customer_name", "seats", "status", "created_at"]