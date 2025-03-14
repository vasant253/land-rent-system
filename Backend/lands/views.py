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
            serializer.save()
            return Response(
                {"message": "Land details uploaded successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        lands = Land.objects.filter(owner=request.user)
        serializer = LandSerializer(lands, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def land_list_create(request):
    lands = Land.objects.all()
    serializer = LandSerializer(lands, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([AllowAny])  # Allow non-authenticated users
def get_land_details(request, id):
    land = get_object_or_404(Land, land_id=id)
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
def get_land_requests(request):
    rent_requests = RentRequest.objects.filter(land__owner=request.user)
    serializer = RentRequestSerializer(rent_requests, many=True)
    return Response(serializer.data)
