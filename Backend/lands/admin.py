from django.contrib import admin
from .models import Land, LandImage

class LandImageInline(admin.TabularInline):  # Allows multiple images to be added inline
    model = LandImage
    extra = 1  # Allows at least one image to be uploaded

@admin.register(Land)
class LandAdmin(admin.ModelAdmin):
    list_display = ("land_id", "owner", "location", "state", "district", "price", "land_status", "created_at")
    list_filter = ("state", "land_status", "land_type")
    search_fields = ("location", "owner__username", "state", "district", "land_type")
    ordering = ("-created_at",)
    inlines = [LandImageInline]  # Adds images inline in the admin panel

@admin.register(LandImage)
class LandImageAdmin(admin.ModelAdmin):
    list_display = ("id", "land", "image")
