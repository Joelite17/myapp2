from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import MCQSet, UserScore
from .serializers import MCQSetSerializer, UserScoreSerializer

from rest_framework import viewsets
from .models import MCQSet
from .serializers import MCQSetSerializer
import random

class MCQSetViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MCQSet.objects.all()
    serializer_class = MCQSetSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        # Convert serialized data to dict (to modify)
        data = serializer.data

        # Get all MCQs for this set and shuffle
        mcqs = list(instance.mcqs.all())
        random.shuffle(mcqs)

        # Take only first 10 questions
        mcqs = mcqs[:10]

        # Serialize them again manually
        from .serializers import MCQSerializer
        data["mcqs"] = MCQSerializer(mcqs, many=True).data

        return Response(data)


class UserScoreViewSet(viewsets.ModelViewSet):
    serializer_class = UserScoreSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only scores of the logged-in user
        return UserScore.objects.filter(user=self.request.user).order_by('-taken_at')

    def perform_create(self, serializer):
        # Associate the logged-in user
        serializer.save(user=self.request.user)
