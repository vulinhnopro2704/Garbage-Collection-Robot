# detector/urls.py
from django.urls import path
from .views import HelloWorldAPIView, ImageDetectAPIView

urlpatterns = [
    path('', HelloWorldAPIView.as_view(), name='hello-world'),
    path('detect/', ImageDetectAPIView.as_view(), name='image-detect')
]
