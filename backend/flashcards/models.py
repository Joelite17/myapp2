from django.db import models
from django.conf import settings
from ckeditor.fields import RichTextField


class FlashcardSet(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="flashcard_sets"
    )
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    # ✅ Add likes just like MCQSet
    likes = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="liked_flashcard_sets",
        blank=True
    )

    def __str__(self):
        return f"{self.title} ({self.user.username})"

    # ✅ Helper method for total likes
    def total_likes(self):
        return self.likes.count()


class Flashcard(models.Model):
    flashcard_set = models.ForeignKey(
        FlashcardSet,
        on_delete=models.CASCADE,
        related_name="cards"
    )
    question = models.CharField(max_length=255)
    answer = RichTextField()
    created_at = models.DateTimeField(auto_now_add=True)
     # Add type field
    CARD_TYPES = [
        ("plain", "Plain"),
        ("list", "List"),
    ]
    type = models.CharField(max_length=10, choices=CARD_TYPES, default="plain")

    def __str__(self):
        return self.question

