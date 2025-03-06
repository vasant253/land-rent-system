from django.urls import path
from django.conf import settings
from .views import RegisterUser
from .views import login_view, logout_view, check_authentication,get_user_details

urlpatterns = [
    path('register/', RegisterUser.as_view(), name='register'),
    path('user/details/', get_user_details, name='user-details'),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("check-auth/", check_authentication, name="check-auth"),
]




