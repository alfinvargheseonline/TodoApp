from rest_framework import serializers
from .models import Project, Todo

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id', 'description', 'completed', 'created_date', 'project']

class ProjectSerializer(serializers.ModelSerializer):
    todos = TodoSerializer(many=True, read_only=True)
    total_todos = serializers.SerializerMethodField()
    completed_todos = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ['id', 'title', 'created_date', 'todos', 'total_todos', 'completed_todos']

    def get_total_todos(self, obj):
        return obj.todos.count()

    def get_completed_todos(self, obj):
        return obj.todos.filter(completed=True).count()