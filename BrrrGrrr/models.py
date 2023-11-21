from django.db import models
from django.contrib.auth.models import User
# from django.contrib.postgres.fields import ArrayField

# Create your models here.

class Stock(models.Model):
    Materials = models.CharField(max_length=50, unique=True,blank=False)
    Quantity = models.IntegerField()
    Price = models.IntegerField()

class Worker(User):
    Employee_id = models.IntegerField()
    # Phone = models.PhoneNumberField("")

class Order(models.Model):
    order_user = models.IntegerField()
    Time = models.TimeField()
    items = models.JSONField(default=dict)

class Order_History(models.Model):
    order_user = models.CharField(max_length=250, blank=False)  
    Time_Order = models.TimeField()
    Time_finished = models.TimeField()
    items = models.JSONField(default=dict)