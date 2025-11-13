from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import MCQSet, UserScore
from .serializers import MCQSetSerializer, UserScoreSerializer, MCQSerializer
import random


class MCQSetViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MCQSet.objects.all()
    serializer_class = MCQSetSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data

        # Shuffle MCQs and take first 10
        mcqs = list(instance.mcqs.all())
        random.shuffle(mcqs)
        mcqs = mcqs[:10]

        data["mcqs"] = MCQSerializer(mcqs, many=True).data
        return Response(data)
 
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_like(self, request, pk=None):
        mcqset = self.get_object()
        user = request.user
        if mcqset.likes.filter(id=user.id).exists():
            mcqset.likes.remove(user)
            liked = False
        else:
            mcqset.likes.add(user)
            liked = True
        return Response({
            "liked": liked,
            "likes_count": mcqset.likes.count()
        })

class UserScoreViewSet(viewsets.ModelViewSet):
    serializer_class = UserScoreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserScore.objects.filter(user=self.request.user).order_by('-taken_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
