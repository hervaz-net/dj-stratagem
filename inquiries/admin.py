from django.contrib import admin

from inquiries.models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ("created_at", "name", "company", "email", "topic", "emailed")
    list_filter = ("topic", "emailed", "created_at")
    search_fields = ("name", "company", "email", "message")
    readonly_fields = ("created_at", "ip_address", "emailed")
    date_hierarchy = "created_at"
