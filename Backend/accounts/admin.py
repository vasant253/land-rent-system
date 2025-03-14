from django.contrib import admin
from django.contrib.auth import get_user_model

User = get_user_model()  # Get the custom user model

@admin.register(User)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'phone','role', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'phone')
    list_filter = ('is_staff', 'is_active')
    list_editable = ('role',)

# OR Simply: admin.site.register(User)
