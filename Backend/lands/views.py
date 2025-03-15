from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Land,RentRequest
from rest_framework.decorators import api_view, permission_classes
from .serializers import LandSerializer
from rest_framework.permissions import AllowAny
from .serializers import RentRequestSerializer

from django.shortcuts import get_object_or_404

class LandUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)  # Needed for image uploads

    def post(self, request, *args, **kwargs):
        serializer = LandSerializer(data=request.data, context={"request": request})  # Pass request context
        if serializer.is_valid():
            serializer.save(status="Pending")
            return Response(
                {"message": "Land details uploaded successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        lands = Land.objects.filter(owner=request.user)
        serializer = LandSerializer(lands, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

#get land by userid
@api_view(["GET"])
@permission_classes([AllowAny])  # Publicly accessible
def get_user_lands_by_id(request, user_id):
    lands = Land.objects.filter(owner=user_id,status="Approved")  # Get lands owned by user
    serializer = LandSerializer(lands, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def land_list_create(request):
    lands = Land.objects.filter(status="Approved")
    serializer = LandSerializer(lands, many=True,)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([AllowAny])  
def get_land_details(request, id):
    land = get_object_or_404(Land, land_id=id,status="Approved")
    serializer = LandSerializer(land)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_lands(request):
    user = request.user
    lands = Land.objects.filter(owner=user)
    serializer = LandSerializer(lands, many=True)
    return Response(serializer.data)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_land(request, land_id):
    try:
        # ✅ Ensure the land exists and belongs to the authenticated user
        land = get_object_or_404(Land, land_id=land_id, owner=request.user)
        
        land.delete()
        return Response({"message": "Land deleted successfully"}, status=status.HTTP_200_OK)

    except Land.DoesNotExist:
        return Response({"error": "Land not found or you do not have permission to delete it"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": "An error occurred", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def edit_land(request, land_id):
    try:
        land = get_object_or_404(Land, land_id=land_id, owner=request.user)

        # ✅ Allow updates with only changed fields
        serializer = LandSerializer(land, data=request.data, partial=True)  

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Land updated successfully!", "data": serializer.data},
                status=status.HTTP_200_OK
            )

        return Response(
            {"error": "Invalid data", "details": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response({"error": "An error occurred", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#searching view
@api_view(["GET"])
@permission_classes([AllowAny])
def search_lands(request):
    """ ✅ Search lands by location, state, district, or land type """
    query = request.GET.get("q", "").strip()  # Get search query

    if not query:
        return Response({"error": "Search query is required."}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ Filter lands based on the search query
    lands = Land.objects.filter(status="Approved").filter(
        location__icontains=query) | Land.objects.filter(
        state__icontains=query) | Land.objects.filter(
        district__icontains=query) | Land.objects.filter(
        land_type__icontains=query)

    serializer = LandSerializer(lands, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

#suggestion in search
@api_view(["GET"])
@permission_classes([AllowAny])  # ✅ Allow unauthenticated users
def suggest_lands(request):
    """ ✅ Suggest lands as users type in the search bar """
    query = request.GET.get("q", "").strip()

    if not query:
        return Response([], status=status.HTTP_200_OK)

    # ✅ Get distinct values for location, state, district, or land_type
    location_suggestions = Land.objects.filter(status="Approved",location__icontains=query).values_list("location", flat=True).distinct()
    state_suggestions = Land.objects.filter(status="Approved",state__icontains=query).values_list("state", flat=True).distinct()
    district_suggestions = Land.objects.filter(status="Approved",district__icontains=query).values_list("district", flat=True).distinct()
    type_suggestions = Land.objects.filter(status="Approved",land_type__icontains=query).values_list("land_type", flat=True).distinct()

    # ✅ Combine all suggestions into one list (remove duplicates)
    suggestions = list(set(location_suggestions) | set(state_suggestions) | set(district_suggestions) | set(type_suggestions))

    return Response(suggestions, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_rent_request(request, land_id):
    land = get_object_or_404(Land, pk=land_id, land_status="Available")

    # Prevent the owner from renting their own land
    if land.owner == request.user:
        return Response({"error": "You cannot rent your own land"}, status=status.HTTP_400_BAD_REQUEST)

    # Check if a rent request already exists for this land
    existing_request = RentRequest.objects.filter(
        land=land,
        renter=request.user,
        status__in=["Pending", "Accepted"]
    ).first()
    if existing_request:
        return Response(
            {"message": "You already have a rent request", "status": existing_request.status},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Create a new rent request
    rent_request = RentRequest.objects.create(
        renter=request.user,
        land=land,
        owner=land.owner,
        status="Pending"  # Default status when request is created
    )

    serializer = RentRequestSerializer(rent_request)
    return Response({
        "message": "Rent request sent successfully",
        "request_id": rent_request.id,
        "status": rent_request.status
    }, status=status.HTTP_201_CREATED)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def manage_rent_request(request, request_id):
    rent_request = get_object_or_404(RentRequest, id=request_id)

    # Check if the logged-in user is the landowner
    if request.user != rent_request.land.owner:
        return Response({"error": "You are not authorized to manage this request."}, status=403)

    action = request.data.get("action")  # Expecting "accept" or "reject"
    if action == "accept":
        rent_request.status = "Accepted"
        rent_request.land.land_status = "Rented"  # Update land status
        rent_request.land.save()
    elif action == "reject":
        rent_request.status = "Rejected"
    else:
        return Response({"error": "Invalid action. Use 'accept' or 'reject'."}, status=400)

    rent_request.save()
    return Response({"message": f"Rent request {action}ed successfully."})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_land_requests(request, land_id=None):
    """
    ✅ Fetch all rent requests for lands owned by the logged-in user.
    ✅ If `land_id` is provided, fetch only requests for that specific land.
    """
    if land_id:
        rent_requests = RentRequest.objects.filter(land_id=land_id, owner=request.user)
    else:
        rent_requests = RentRequest.objects.filter(owner=request.user)

    serializer = RentRequestSerializer(rent_requests, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_pending_lands(request):
    """ ✅ Fetch all lands with 'Pending' status for admin approval """
    if request.user.role != "admin":  # ✅ Check role instead of is_staff
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

    lands = Land.objects.filter(status="Pending")
    serializer = LandSerializer(lands, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def manage_land_status(request, id):
    """ ✅ Allows admin to approve or reject lands """
    if request.user.role != "admin":  # ✅ Check role instead of is_staff
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

    land = get_object_or_404(Land, land_id=id, status="Pending")  # Only pending lands

    action = request.data.get("action")  # Expecting "approve" or "reject"
    if action == "approve":
        land.status = "Approved"
    elif action == "reject":
        land.status = "Rejected"
    else:
        return Response({"error": "Invalid action. Use 'approve' or 'reject'."}, status=400)

    land.save()
    return Response({"message": f"Land {action}d successfully."})

