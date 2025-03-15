from django.urls import path
from .views import LandUploadView,land_list_create,get_land_details,create_rent_request,manage_rent_request,get_land_requests
from django.conf import settings
from django.conf.urls.static import static
from .views import get_user_lands,edit_land,delete_land,search_lands,suggest_lands,get_user_lands_by_id
from .views import get_pending_lands,manage_land_status

urlpatterns = [
    path("upload-land/", LandUploadView.as_view(), name="upload_land"),
    path('lands-fetch/', land_list_create, name='land-list-create'),
    path("lands/<int:id>/", get_land_details, name="get_land_details"),
    path("lands/<int:land_id>/rent/", create_rent_request, name="create_rent_request"),
    path("rent-request/manage/<int:request_id>/", manage_rent_request, name="manage_rent_request"),
    path("get-land-requests/<int:land_id>/", get_land_requests, name="land_requests"),
    path("user/lands/", get_user_lands, name="user_lands"),
    path("lands/<int:land_id>/edit/", edit_land, name="edit_land"),
    path("lands/<int:land_id>/delete/", delete_land, name="delete_land"),
    path("search/", search_lands, name="search_lands"),
    path("suggest/", suggest_lands, name="suggest_lands"),
    path("lands/user/<int:user_id>/", get_user_lands_by_id, name="get-user-lands"),
    path("lands/pending/", get_pending_lands, name="get-pending-lands"),
    path("lands/<int:id>/status/", manage_land_status, name="manage-land-status"),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
