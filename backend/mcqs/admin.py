from django.contrib import admin
from .models import MCQSet, MCQ, Option, UserScore

# ===========================
# Inline for Options
# ===========================
class OptionInline(admin.StackedInline):
    model = Option
    extra = 2  # show 2 empty rows by default
    min_num = 1
    fields = ['key', 'text', 'is_correct']
    verbose_name = "Option"
    verbose_name_plural = "Options"
    show_change_link = True  # optional: allows editing individual options

# ===========================
# MCQ Admin
# ===========================
@admin.register(MCQ)
class MCQAdmin(admin.ModelAdmin):
    list_display = ['question_short', 'mcq_set', 'mcq_type', 'correct_options']
    list_filter = ['mcq_set', 'mcq_type']
    search_fields = ['question']
    inlines = [OptionInline]

    def question_short(self, obj):
        return obj.question[:50] + ("..." if len(obj.question) > 50 else "")
    question_short.short_description = "Question"

    def correct_options(self, obj):
        correct = obj.options.filter(is_correct=True)
        return ", ".join([f"{opt.key}" for opt in correct])
    correct_options.short_description = "Correct Answer(s)"

# ===========================
# MCQSet Admin
# ===========================
@admin.register(MCQSet)
class MCQSetAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_at', 'mcq_count']
    search_fields = ['title']

    def mcq_count(self, obj):
        return obj.mcqs.count()
    mcq_count.short_description = "Number of Questions"

# ===========================
# Option Admin (optional)
# ===========================
@admin.register(Option)
class OptionAdmin(admin.ModelAdmin):
    list_display = ['mcq', 'key', 'text',  'is_correct']
    list_filter = ['is_correct']
    search_fields = ['text']

# ===========================
# UserScore Admin
# ===========================
@admin.register(UserScore)
class UserScoreAdmin(admin.ModelAdmin):
    list_display = ['user', 'mcq_set', 'score', 'taken_at']
    list_filter = ['mcq_set']
