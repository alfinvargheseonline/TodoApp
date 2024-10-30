from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Project, Todo
from .serializers import ProjectSerializer, TodoSerializer
import markdown

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    @action(detail=True, methods=['post'])
    def export_markdown(self, request, pk=None):
        project = self.get_object()
        todos = project.todos.all()
        
        # Generate markdown content
        content = f"# {project.title}\n\n"
        content += f"Summary: {todos.filter(completed=True).count()} / {todos.count()} completed\n\n"
        
        content += "## Pending Todos\n"
        for todo in todos.filter(completed=False):
            content += f"- [ ] {todo.description}\n"
        
        content += "\n## Completed Todos\n"
        for todo in todos.filter(completed=True):
            content += f"- [x] {todo.description}\n"
        
        return Response({'markdown': content})

class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

    @action(detail=True, methods=['post'])
    def toggle_complete(self, request, pk=None):
        todo = self.get_object()
        todo.completed = not todo.completed
        todo.save()
        return Response(TodoSerializer(todo).data)