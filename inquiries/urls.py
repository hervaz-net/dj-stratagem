from django.urls import path

from inquiries.views import contact

urlpatterns = [
    path("contact/", contact, name="contact"),
]
