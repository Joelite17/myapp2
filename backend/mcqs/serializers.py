from rest_framework import serializers
from .models import MCQSet, MCQ, Option


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ["id", "text", "value", "is_correct"]


class MCQSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True)

    class Meta:
        model = MCQ
        fields = ["id", "question", "mcq_type", "options", "created_at"]

    def create(self, validated_data):
        options_data = validated_data.pop("options")
        mcq = MCQ.objects.create(**validated_data)
        for option_data in options_data:
            Option.objects.create(mcq=mcq, **option_data)
        return mcq


class MCQSetSerializer(serializers.ModelSerializer):
    mcqs = MCQSerializer(many=True, required=False)

    class Meta:
        model = MCQSet
        fields = ["id", "title", "created_at", "mcqs"]

    def create(self, validated_data):
        mcqs_data = validated_data.pop("mcqs", [])
        mcq_set = MCQSet.objects.create(**validated_data)
        for mcq_data in mcqs_data:
            options_data = mcq_data.pop("options", [])
            mcq = MCQ.objects.create(mcq_set=mcq_set, **mcq_data)
            for option_data in options_data:
                Option.objects.create(mcq=mcq, **option_data)
        return mcq_set
