from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime
#导入AbstractUser
# Create your models here.
class UserProfile(AbstractUser):
    '''
    继承Django的AbstractUser 并向里面添加两条数据内容怀疑
    '''
    #image = models.ImageField(max_length=100, upload_to='image/%Y/%m', default='image?default.png', verbose_name='头像')
    gender = models.CharField(max_length=6,choices=(('male','男'),('female','女')),default='female',verbose_name='性别')
    memo = models.TextField(null=True, blank=True,verbose_name='便签')
    class Meta:
        verbose_name = '用户信息'
        verbose_name_plural = verbose_name #指定模型的复数形式是什么,如果不指定Django会自动在模型名称后加一个’s’

class UserTodo(models.Model):
    #user_index = models.DateTimeField(default=0,verbose_name="用户todo索引")
    deadline = models.DateTimeField(default=datetime.now(),verbose_name='截至时间')
    user_email = models.ForeignKey(UserProfile,on_delete=models.CASCADE)  #设置外键，关联到UserProfile表
    # models.CASCADE表示若删除用户，则用户下的所有UserTodo也会被删除
    ToDolist = models.CharField(max_length=255,verbose_name='todo')
    done = models.BooleanField(default=False,verbose_name='完成状态')
    #state_imp = models.IntegerField(choices=((1,'非常重要'),(2,'一般'),(3,'不重要')),default=1)
    class Meta:
        verbose_name = '用户自增信息'
        verbose_name_plural = verbose_name

class EmailVerifyRecord(models.Model):
    code = models.CharField(max_length=20,verbose_name='验证码')
    email = models.EmailField(max_length=50, verbose_name='邮箱')
    send_type = models.CharField(max_length=18,
                                 choices=(('register', '邮箱'), ('forget', '修改密码'), ('update_email', '修改邮箱')),
                                 verbose_name='验证码类型')
    send_time = models.DateField(default=datetime.now, verbose_name='发送时间')

    class Meta:
        verbose_name = '邮箱验证码'
        verbose_name_plural = '邮箱验证码'

#当启用邮件系统时用到下面的models
class UserMessage(models.Model):
    # 如果 为 0 代表全局消息，否则就是用户的 ID
    user = models.IntegerField(default=0, verbose_name='接受用户')
    message = models.CharField(max_length=500, verbose_name='消息内容')
    has_read = models.BooleanField(default=False, verbose_name='是否已读')
    add_time = models.DateTimeField(default=datetime.now, verbose_name='添加时间')

    class Meta:
        verbose_name = '用户消息'
        verbose_name_plural = verbose_name
