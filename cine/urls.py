from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ReservationViewSet, ShowViewSet
from .movie_catalog_views import movie_catalog_list_create, movie_catalog_detail
from .reservation_event_views import reservation_event_detail,reservation_event_list_create
router = DefaultRouter()
router.register(r"reservation", ReservationViewSet, basename="reservation")
router.register(r"shows", ShowViewSet, basename="shows")

urlpatterns = [
    path("movie-catalog/", movie_catalog_list_create),
    path("movie-catalog/<str:id>/", movie_catalog_detail),
    path("reservation-event/", reservation_event_list_create),
    path("reservation-event/<str:id>/", reservation_event_detail),
]
urlpatterns += router.urls