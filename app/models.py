from django.db import models

# Create your models here.
class UserInfo(models.Model):
    email = models.EmailField(verbose_name='邮箱')
    #一个带有检查 Email 合法性的 CharField，不接受 maxlength 参数。
    username = models.CharField(max_length=100,verbose_name='用户名')
    pwd = models.CharField(max_length=30,verbose_name='密码')
    create_time = models.DateTimeField(default=0,verbose_name='用户创建时间')
    def __str__(self):
        return self.username

class UserTodo(models.Model):
    user_email = models.EmailField(primary_key=True)
    ToDolist = models.TextField()
    memo = models.TextField()
    def __str__(self):
        return self.user_todo
