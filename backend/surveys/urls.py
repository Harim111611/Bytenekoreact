from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    SurveyViewSet, QuestionViewSet, ResponseViewSet,
    register, me,
)

router = DefaultRouter()
router.register(r"surveys", SurveyViewSet, basename="surveys")
router.register(r"questions", QuestionViewSet, basename="questions")
router.register(r"responses", ResponseViewSet, basename="responses")

urlpatterns = [
    path("", include(router.urls)),
    path("auth/register", register, name="register"),
    path("auth/me", me, name="me"),
]
