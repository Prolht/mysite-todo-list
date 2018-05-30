from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime
#导入AbstractUser
# Create your models here.
class UserProfile(AbstractUser):
    '''
    继承Django的AbstractUser 并向里面添加两条数据内容
    '''
    gender = models.CharField(max_length=6,choices=(('male','男'),('female','女')),default='female',verbose_name='性别')
    class Meta:
        verbose_name = '用户信息'
        verbose_name_plural = verbose_name #指定模型的复数形式是什么,如果不指定Django会自动在模型名称后加一个’s’

class UserTodo(models.Model):
    #user_index = models.DateTimeField(default=0,verbose_name="用户todo索引")
    created_time = models.DateTimeField(default=datetime.now,verbose_name='创建时间')
    user_email = models.ForeignKey(UserProfile,on_delete=models.CASCADE)  #设置外键，关联到UserProfile表
    # models.CASCADE表示若删除用户，则用户下的所有UserTodo也会被删除
    ToDolist = models.CharField(max_length=255,verbose_name='todo')
    memo = models.TextField(null=True, blank=True,verbose_name='便签')
    done = models.BooleanField(default=False,verbose_name='完成状态')
    #state_imp = models.IntegerField(choices=((1,'非常重要'),(2,'一般'),(3,'不重要')),default=1)
    class Meta:
        verbose_name = '用户自增信息'
        verbose_name_plural = verbose_name

