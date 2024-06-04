from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Complaint(models.Model):
    id = models.AutoField(primary_key=True)
    description = models.CharField (max_length=4000)    
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE,  related_name="user_complaint")   
    enabled = models.BooleanField()  
    latitude = models.FloatField()   
    longitude = models.FloatField()  
    photo = models.URLField() 
    danger = models.IntegerField()

    def serialize(self):

        return {
            "id": self.id,
            "description": self.description,
            "username": self.user.username,
            "created": self.created.strftime("%b %d %Y, %I:%M %p"),
            "latitude": self.latitude,
            "longitude": self.longitude,
            "photo" : self.photo,
            "danger" : self.danger
        }