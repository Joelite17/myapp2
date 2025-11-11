from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MCQSetViewSet

router = DefaultRouter()
router.register("", MCQSetViewSet, basename="mcqs")

urlpatterns = [
    path("", include(router.urls)),
]
