from django.contrib import admin
from .models import Land, LandImage

class LandImageInline(admin.TabularInline):  
    model = LandImage
    extra = 1  # Allows adding multiple images directly in the admin panel

class LandAdmin(admin.ModelAdmin):
    list_display = ('name', 'landType', 'created_at')  # Show these fields in the admin list
    search_fields = ('name', 'landType')  # Enable search functionality
    list_filter = ('landType', 'created_at')  # Add filters for land type and creation date
    inlines = [LandImageInline]  # Allow uploading multiple images directly from the admin panel

# Register models
admin.site.register(Land, LandAdmin)
admin.site.register(LandImage)
