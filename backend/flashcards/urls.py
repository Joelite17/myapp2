from rest_framework.routers import DefaultRouter
from .views import FlashcardSetViewSet

router = DefaultRouter()
router.register(r'sets', FlashcardSetViewSet, basename='flashcardset')

urlpatterns = router.urls
