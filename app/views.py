from django.shortcuts import render
from django.shortcuts import render_to_response
from django.shortcuts import HttpResponse
from django.views.generic.base import View
from .models import UserProfile
from .forms import RegisterForm
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password

#业务处理逻辑的编写
# Create your views here.

#表单
#用户注册

class RegisterView(View):
    def get(self,request):
        #get 请求，可以将验证码等html render到register.html中
        register_form = RegisterForm()
        return render(request,'app/register.html',{'register_form':register_form})

    def post(self,request):
        register_form = RegisterForm(request.POST)
        if register_form.is_valid():
            email = request.POST.get('user_email','') #否则为空
            username = request.POST.get('user_name','')
            if UserProfile.objects.filter(username=username):
                return render(request,'app/register.html',{'register_form':register_form,'msg_user':'用户已存在!'})
            if UserProfile.objects.filter(email=email):
                return render(request,'app/register.html',{'register_form':register_form,'msg_email':'该邮箱已经注册!'})
            password = request.POST.get('password1','')
            user_profile = UserProfile()
            user_profile.username = username
            user_profile.email = email
            user_profile.password = make_password(password)
            user_profile.is_active = False
            user_profile.save()

            #注册完成
            return render(request,'app/success.html')
        else:
            print(register_form)
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

