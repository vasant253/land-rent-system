from django.urls import path
from .views import LandUploadView

urlpatterns = [
    path('upload-land/', LandUploadView.as_view(), name='upload-land'),
]
