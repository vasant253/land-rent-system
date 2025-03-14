from django.urls import path
from django.conf import settings
from .views import RegisterUserView
from .views import UserLoginView,UserListView, UserDetailView, get_user_details,update_profile
from rest_framework_simplejwt.views import TokenRefreshView
from .views import ProtectedView,check_availability

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path("login/", UserLoginView.as_view(), name="login"),
    path("check-availability/", check_availability, name="check_availability"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("user/", get_user_details, name="get_user_details"),
    path("protected-route/", ProtectedView.as_view(), name="protected-route"),
    path('usersList/', UserListView.as_view(), name='user-list'),
    path('usersList/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path("user/update/", update_profile, name="update_profile"),
]



