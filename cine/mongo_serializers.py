from rest_framework import serializers
from .models import Reservation

class MovieCatalogSerializer(serializers.Serializer):
    movie_title = serializers.CharField(max_length=120)
    genre = serializers.CharField(required=False)
    duration_min = serializers.IntegerField(required=False)
    rating = serializers.CharField(required=False)
    is_active = serializers.BooleanField(default=True)

class ReservationsEventSerializer(serializers.Serializer):
    def validate_reservation_id(self, value):
        if not Reservation.objects.filter(id=value).exists():
            raise serializers.ValidationError("Reservation not found")
        return value
    reservation_id = serializers.IntegerField() 
    class Type:
        CREATED = "creado"
        CONFIRMED = "confirmado"
        CANCELLED = "cancelado"
        CHECK_IN ="ingreso"

        CHOICES = [
            (CREATED, "Creado"),
            (CONFIRMED, "Confirmado"),
            (CANCELLED, "Cancelado"),
            (CHECK_IN, "Ingreso")
        ]# ID de Vehiculo (Postgres)
    event_type = serializers.ChoiceField(
        choices=Type.CHOICES,
        default=Type.CREATED
    )
    class Source:
        WEB = "web"
        MOBILE = "movil"
        SYSTEM = "sistema"

        CHOICES = [
            (WEB, "Web"),
            (MOBILE, "Movil"),
            (SYSTEM, "Sistema"),
        ]
    source = serializers.ChoiceField(
        choices=Source.CHOICES,
        default=Source.SYSTEM
    )# ObjectId (string) de service_types
    note = serializers.CharField(required=False)
    created_at = serializers.DateField(required=False)    # Ej: 2026-02-04
