from django.shortcuts import render
from django.shortcuts import render_to_response
from django.shortcuts import HttpResponse
from django.views.generic.base import View
from django import forms
from .models import UserInfo
from django.contrib.auth.models import User
from .forms import RegisterForm


#业务处理逻辑的编写
# Create your views here.

#表单
#用户注册
class RegisterView(View):
    def get(self,request):
        #get 请求，可以将验证码等html render到register.html中
        register_form = RegisterForm()
        return render(request,'app/register_base.html',{'register_form':register_form})
    def post(self,request):
        register_form = RegisterForm(request.POST)
        if register_form.is_valid():
            email = request.POST.get('email','') #否则为空
            username = request.POST.get('username','')
            if UserInfo.objects.filter(username=username):
                return render(request,'app/register_base.html',{'register_form':register_form,'msg_user':'用户已存在!'})
            if UserInfo.objects.filter(email=email):
                return render(request,'app/register_base.html',{'register_form':register_form,'msg_email':'该邮箱已经注册!'})
            password = request.POST.get('password','')
            userInfo = UserInfo()
            userInfo.username = username
            userInfo.email = email
            userInfo.pwd = password
            userInfo.save()

            #注册完成
            return render(request,'app/success.html')
        return render(request,'app/register.html',{'register_form':register_form})



def login(request):
    if request.method == "POST":
        username = request.POST.get("username",None)
        password = request.POST.get("password",None)
    return render(request, 'app/login.html')

def main(request):
    return render(request,'app/main2.html')

def register(request):
    return render(request,'app/register_base.html')


def index(request):
    return render(request, 'app/index.html')

