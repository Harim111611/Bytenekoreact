# backend/surveys/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Survey, Question, Response, Answer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email"]


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            "id", "survey", "text", "qtype", "required",
            "options", "order",
        ]


class AnswerSerializer(serializers.ModelSerializer):
    # Unificar en un solo "value" lo que venga de BD
    value = serializers.SerializerMethodField()

    class Meta:
        model = Answer
        fields = ["id", "response", "question", "value", "value_text",
                  "value_number", "value_bool", "value_choice", "value_raw"]
        read_only_fields = ["value"]

    def get_value(self, obj):
        # Prioridad según tipo
        if obj.value_text:
            return obj.value_text
        if obj.value_number is not None:
            return float(obj.value_number)
        if obj.value_bool is not None:
            return bool(obj.value_bool)
        if obj.value_choice is not None:
            return obj.value_choice
        if obj.value_raw is not None:
            return obj.value_raw
        return None

    # Permitir setear "value" en POST creando el campo adecuado
    def to_internal_value(self, data):
        ret = super().to_internal_value(data)
        val = data.get("value", None)
        if val is not None:
            # Intenta mapear automáticamente
            if isinstance(val, bool):
                ret["value_bool"] = val
            elif isinstance(val, (int, float)):
                ret["value_number"] = val
            elif isinstance(val, (list, dict)):
                ret["value_choice"] = val
            else:
                ret["value_text"] = str(val)
        return ret


class ResponseSerializer(serializers.ModelSerializer):
    submitted_by = UserSerializer(read_only=True)
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Response
        fields = ["id", "survey", "submitted_by", "submitted_at",
                  "external_id", "answers"]


class SurveySerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Survey
        fields = ["id", "title", "description", "status",
                  "created_by", "created_at", "questions"]
