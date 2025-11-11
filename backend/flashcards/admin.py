from django.contrib import admin
from .models import *

class FlashcardInline(admin.TabularInline):
    model = Flashcard
    extra = 1

@admin.register(FlashcardSet)
class FlashcardSetAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at')
    inlines = [FlashcardInline]
