from rest_framework import serializers
from .models import Show, Reservation

class ShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Show
        fields = "__all__"

class ReservationSerializer(serializers.ModelSerializer):
    showid_nombre = serializers.CharField(source="show_id.movie_title", read_only=True)

    class Meta:
        model = Reservation
        fields = "__all__, showid_nombre"