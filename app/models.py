from django.db import models

# Create your models here.
class UserInfo(models.Model):
    email = models.EmailField(primary_key=True)
    #一个带有检查 Email 合法性的 CharField，不接受 maxlength 参数。
    UserName = models.CharField(max_length=30)
    pwd = models.CharField(max_length=30)
    create_time = models.DateTimeField(default=0)

class UserTodo(models.Model):
    user_email = models.EmailField()
    ToDolist = models.TextField()
    memo = models.TextField()
