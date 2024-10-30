from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, TodoViewSet

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'myapp', TodoViewSet, basename='todo')

# The API URLs are determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
]