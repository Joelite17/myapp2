# accounts/views.py
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from .serializers import RegisterSerializer, LoginSerializer, PasswordResetRequestSerializer, SetNewPasswordSerializer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from .utils import send_password_reset_email
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {"refresh": str(refresh), "access": str(refresh.access_token)}

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)

class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        tokens = get_tokens_for_user(user)
        return Response({"user": {"username": user.username, "email": user.email}, "tokens": tokens})


class PasswordResetRequestView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            send_password_reset_email(user, token)  # uses React link now
        except User.DoesNotExist:
            pass  # don't reveal whether email exists
        return Response(
            {"detail": "If the email exists, a reset link was sent."},
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, uid, token):
        serializer = SetNewPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(User, pk=uid)
        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(serializer.validated_data["password"])
        user.save()
        return Response({"detail": "Password has been reset."}, status=status.HTTP_200_OK)
