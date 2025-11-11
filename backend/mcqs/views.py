from rest_framework import viewsets, permissions
from .models import MCQSet
from .serializers import MCQSetSerializer


class MCQSetViewSet(viewsets.ModelViewSet):
    serializer_class = MCQSetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MCQSet.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
