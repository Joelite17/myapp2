from rest_framework import serializers
from .models import MCQSet, MCQ, Option, UserScore

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['key', 'text', 'is_correct']


class MCQSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)

    class Meta:
        model = MCQ
        fields = ['id', 'question', 'mcq_type', 'options', 'explanation']


class MCQSetSerializer(serializers.ModelSerializer):
    mcqs = MCQSerializer(many=True, read_only=True)

    class Meta:
        model = MCQSet
        fields = ['id', 'title', 'mcqs']

class UserScoreSerializer(serializers.ModelSerializer):
    mcq_set_title = serializers.CharField(source='mcq_set.title', read_only=True)

    class Meta:
        model = UserScore
        fields = ['id', 'mcq_set', 'mcq_set_title', 'score', 'total_score', 'taken_at']
        read_only_fields = ['taken_at']

