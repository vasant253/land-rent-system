from django.urls import path
from .views import LandUploadView,land_list_create,get_land_details,create_rent_request,manage_rent_request,get_land_requests
from django.conf import settings
from django.conf.urls.static import static
from .views import get_user_lands,edit_land,delete_land

urlpatterns = [
    path("upload-land/", LandUploadView.as_view(), name="upload_land"),
    path('lands-fetch/', land_list_create, name='land-list-create'),
    path("lands/<int:id>/", get_land_details, name="get_land_details"),
    path("lands/<int:land_id>/rent/", create_rent_request, name="create_rent_request"),
    path("rent-request/manage/<int:request_id>/", manage_rent_request, name="manage_rent_request"),
    path("land-requests/", get_land_requests, name="land_requests"),
    path("user/lands/", get_user_lands, name="user_lands"),
    path("lands/<int:land_id>/edit/", edit_land, name="edit_land"),
    path("lands/<int:land_id>/delete/", delete_land, name="delete_land"),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
