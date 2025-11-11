from django.conf import settings
from django.db import models
from ckeditor.fields import RichTextField

class Note(models.Model):
    title = models.CharField(max_length=255)
    content = RichTextField()
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # <-- use this instead of auth.User
        on_delete=models.CASCADE,
        related_name="notes",
    )
    visibility = models.CharField(
        max_length=50,
        choices=[
            ("private", "Private"),
            ("public", "Public"),
            ("subscriber", "Subscriber Only"),
        ],
        default="private",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
