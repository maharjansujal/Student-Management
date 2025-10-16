from django.db import models

# Create your models here.
class Student(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    grade = models.CharField(max_length=50)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name