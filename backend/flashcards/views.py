from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import *
from .serializers import *

 
class FlashcardSetViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FlashcardSet.objects.all()
    serializer_class = FlashcardSetSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_like(self, request, pk=None):
        flashcard_set = self.get_object()
        user = request.user

        if flashcard_set.likes.filter(id=user.id).exists():
            flashcard_set.likes.remove(user)
            liked = False
        else:
            flashcard_set.likes.add(user)
            liked = True

        return Response({
            "liked": liked,
            "likes_count": flashcard_set.total_likes()
        })


