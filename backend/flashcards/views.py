# views.py
from rest_framework import viewsets, permissions
from .models import FlashcardSet
from .serializers import FlashcardSetSerializer

class FlashcardSetViewSet(viewsets.ModelViewSet):
    serializer_class = FlashcardSetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FlashcardSet.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
