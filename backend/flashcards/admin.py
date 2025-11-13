from django.contrib import admin
from .models import FlashcardSet, Flashcard

# ===========================
# Inline for Flashcards
# ===========================
class FlashcardInline(admin.StackedInline):
    model = Flashcard
    extra = 2  # show 2 empty rows by default
    min_num = 1
    fields = ['question', 'answer']
    verbose_name = "Flashcard"
    verbose_name_plural = "Flashcards"
    show_change_link = True  # allows editing individual flashcards

# ===========================
# Flashcard Admin
# ===========================
@admin.register(Flashcard)
class FlashcardAdmin(admin.ModelAdmin):
    list_display = ['question_short', 'flashcard_set', 'created_at']
    list_filter = ['flashcard_set']
    search_fields = ['question']

    def question_short(self, obj):
        return obj.question[:50] + ("..." if len(obj.question) > 50 else "")
    question_short.short_description = "Question"

# ===========================
# FlashcardSet Admin
# ===========================
@admin.register(FlashcardSet)
class FlashcardSetAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'created_at', 'flashcard_count']
    search_fields = ['title', 'user__username']
    list_filter = ['user', 'created_at']
    def flashcard_count(self, obj):
        return obj.cards.count()
    flashcard_count.short_description = "Number of Cards"
