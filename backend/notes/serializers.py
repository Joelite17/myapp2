# notes/serializers.py
from rest_framework import serializers
from .models import Note

class NoteSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model = Note
        fields = ["id", "title", "content", "author", "author_username", "visibility", "created_at", "updated_at"]
        read_only_fields = ["id", "author", "created_at", "updated_at"]
