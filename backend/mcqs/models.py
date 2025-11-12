from django.db import models
from django.conf import settings

class MCQSet(models.Model):
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class MCQ(models.Model):
    QUESTION_TYPES = [
        ('TF', 'True/False'),
        ('MCQ', 'Multiple Choice'),
    ]
    mcq_set = models.ForeignKey(MCQSet, on_delete=models.CASCADE, related_name='mcqs')
    question = models.TextField()
    mcq_type = models.CharField(max_length=10, choices=QUESTION_TYPES, default='TF')
    explanation = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question[:50]


class Option(models.Model):
    mcq = models.ForeignKey(MCQ, on_delete=models.CASCADE, related_name='options')
    key = models.CharField(max_length=5)  # "A", "B", "C", etc.
    text = models.TextField()
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        mcq_id = self.mcq.id if self.mcq else "None"
        return f"MCQ {mcq_id} - {self.key}"


class UserScore(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='scores')
    mcq_set = models.ForeignKey(MCQSet, on_delete=models.CASCADE)
    score = models.FloatField()
    total_score = models.FloatField()
    taken_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.mcq_set.title} - {self.score}"
