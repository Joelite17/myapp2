# myauthproj/urls.py
from django.urls import path, include
from django.contrib import admin
urlpatterns = [
    path('admin/', admin.site.urls),
    path("accounts/", include("accounts.urls", namespace="accounts")),
    path("notes/", include("notes.urls")),
    path('flashcardsets/', include('flashcards.urls')), 
    path('mcqsets/', include('mcqs.urls')),
    path('mcqs/scores/', include('mcqs.scores_urls')),  # Scores endpoint
]
