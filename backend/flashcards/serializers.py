from rest_framework import serializers
from .models import FlashcardSet, Flashcard


class FlashcardSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Flashcard
        fields = ['id', 'question', 'answer']


class FlashcardSetSerializer(serializers.ModelSerializer):
    cards = FlashcardSerializer(many=True)

    class Meta:
        model = FlashcardSet
        fields = ['id', 'title', 'created_at', 'cards']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        cards_data = validated_data.pop('cards', [])
        flashcard_set = FlashcardSet.objects.create(**validated_data)

        for card_data in cards_data:
            Flashcard.objects.create(flashcard_set=flashcard_set, **card_data)

        return flashcard_set

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.save()

        cards_data = validated_data.pop('cards', [])
        existing_cards = {card.id: card for card in instance.cards.all()}

        for card_data in cards_data:
            card_id = card_data.get('id')

            if card_id and card_id in existing_cards:
                # ✅ Update existing flashcard
                card = existing_cards.pop(card_id)
                card.question = card_data.get('question', card.question)
                card.answer = card_data.get('answer', card.answer)
                card.save()
            else:
                # ✅ Create new flashcard (no id)
                card_data.pop('id', None)  # prevent IntegrityError
                Flashcard.objects.create(flashcard_set=instance, **card_data)

        # ✅ Delete flashcards removed from the set
        for card in existing_cards.values():
            card.delete()

        return instance
