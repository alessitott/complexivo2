from django.db import models

class Show(models.Model):
    movie_title = models.CharField(max_length=120, unique=True)
    room = models.CharField(max_length=20)
    price = models.DecimalField(max_digits=10, decimal_places=2 )
    available_seats = models.IntegerField()
    
    def __str__(self):
        return self.movie_title

class Reservation(models.Model):
    show_id = models.ForeignKey(Show, on_delete=models.PROTECT, related_name="reservaciones")
    customer_name = models.CharField(max_length=120)
    seats = models.IntegerField()
    class Estado(models.TextChoices):
        RESERVED= "reservado","Reservado"
        CONFIRMED= "confirmado","Confirmado"
        CANCELLED= "cancelado","Cancelado"
    status = models.CharField(
        max_length=20,
        choices=Estado.choices,
        default=Estado.RESERVED)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.show_id.movie_title} {self.customer_name} ({self.status})"