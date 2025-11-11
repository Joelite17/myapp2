# notes/admin.py
from django.contrib import admin
from .models import Note

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "visibility", "created_at")
    list_filter = ("visibility", "created_at")
    search_fields = ("title", "content", "author__username")
