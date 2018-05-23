from django.contrib import admin

from .models import UserInfo,UserTodo

# Register your models here.
admin.site.register(UserInfo)
admin.site.register(UserTodo)
