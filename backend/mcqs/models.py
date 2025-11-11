from django.db import models
from django.conf import settings

class MCQSet(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="mcq_sets")
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.user.username})"


class MCQ(models.Model):
    mcq_set = models.ForeignKey(MCQSet, on_delete=models.CASCADE, related_name="mcqs")
    question = models.CharField(max_length=500)
    mcq_type = models.CharField(max_length=20, choices=[("Best Option", "Best Option"), ("True/False", "True/False")])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question


class Option(models.Model):
    mcq = models.ForeignKey(MCQ, on_delete=models.CASCADE, related_name="options")
    text = models.CharField(max_length=255)
    value = models.CharField(max_length=10, blank=True, null=True)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text
