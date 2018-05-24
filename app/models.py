from django.db import models
from django.contrib.auth.models import AbstractUser
#导入AbstractUser
# Create your models here.
class UserProfile(AbstractUser):
    '''
    继承Django的AbstractUser 并向里面添加两条数据内容
    '''
    ToDolist = models.TextField(null=True,verbose_name='todo')
    memo = models.TextField(null=True,verbose_name='便签')
    class Meta:
        verbose_name = '用户信息'
        verbose_name_plural = verbose_name #指定模型的复数形式是什么,如果不指定Django会自动在模型名称后加一个’s’
    def __str__(self):
        return self.username
