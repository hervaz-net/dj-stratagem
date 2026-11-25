from django.db import models


class Inquiry(models.Model):
    name = models.CharField(max_length=120)
    company = models.CharField(max_length=160)
    email = models.EmailField()
    phone = models.CharField(max_length=40, blank=True)
    role = models.CharField(max_length=80)
    topic = models.CharField(max_length=120)
    message = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    emailed = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "inquiries"

    def __str__(self):
        return f"{self.name} · {self.company}"
