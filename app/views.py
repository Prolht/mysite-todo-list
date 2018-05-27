from django.db.models import Q
from django.contrib.auth.backends import ModelBackend
from django.shortcuts import render
from django.views.generic.base import View
from .models import UserProfile,UserTodo
from .forms import RegisterForm,LoginForm,TodoForm
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate,login,logout
from django.urls import reverse
from django.http import HttpResponse,HttpResponsePermanentRedirect,HttpResponseRedirect
#业务处理逻辑的编写
#自定义用户验证函数，实现邮箱或用户名都能登陆
class MyBackend(ModelBackend):
    def authenticate(self,username=None,password=None,**kwargs):
        try:
            user = UserProfile.objects.get(Q(username=username)|Q(email=username))
            if user.check_password(password):
                return user
        except Exception as e:
            return None
# Create your views here.
#表单
#用户注册
class RegisterView(View):
    def get(self,request):
        #get 请求，可以将验证码等html render到register.html中
        register_form = RegisterForm()
        return render(request,'register.html',{'register_form':register_form})

    def post(self,request):
        register_form = RegisterForm(request.POST)
        if register_form.is_valid():
            email = request.POST.get('user_email','') #否则为空
            username = request.POST.get('user_name','')
            if UserProfile.objects.filter(username=username):
                return render(request,'register.html',{'register_form':register_form,'msg_user':'用户已存在!'})
            if UserProfile.objects.filter(email=email):
                return render(request,'register.html',{'register_form':register_form,'msg_email':'该邮箱已经注册!'})
            password = request.POST.get('password1','')
            user_profile = UserProfile()
            user_profile.username = username
            user_profile.email = email
            user_profile.password = make_password(password)
            user_profile.is_active = True #判断用户是否激活
            user_profile.save()

            #注册完成
            return render(request,'success.html')
        else:
            print(register_form)
        return render(request,'register.html',{'register_form':register_form})


#用户登陆
class LoginView(View):
    def get(self,request):
        return render(request,'login.html')
    def post(self,request):
        login_form = LoginForm(request.POST)
        if login_form.is_valid():
            user_name = request.POST.get('username','')
            password = request.POST.get('password','')
            #与数据库中的用户进行比对
            #上面已经地authenticate进行了重写 若成功则返回user
            user = authenticate(request,username=user_name,password=password)
            if user is not None:
                if user.is_active:
                    login(request, user)
                    return render(request,'main2.html')
            return render(request,'login.html',{'msg':'用户名或密码错误!'})
        else:
            print(login_form)
        print(login_form.errors)
        return render(request,'login.html',{'msg':'用户名或密码错误!'})

#用户退出登陆
class LogoutView(View):
    def get(self,request):
        logout(request)
        return HttpResponseRedirect(reverse('index'))

class IndexView(View):
    def get(self,request):
        return render(request, 'index.html')

class MainView(View):
    def get(self,request):
        return render(request, 'main2.html')
    def post(self,request):
        print('hhhh')
        main_form = TodoForm(request.POST)
        if main_form.is_valid():
            print('ddd')
            user_email= UserProfile.objects.get(id=2)
            memo = 'zuofan'
            done = True
            todo = 'dddd'
            print('todo')
            todo1 = request.POST.get('add_todo','')
            print(todo1)
            '''user_todo = UserTodo(ToDolist=todo,done=done,memo=memo,user_email=user_email)'''
            #user_todo.save()
        else:
            print(main_form)
        return render(request,'main2.html')
#全局404 函数
def page_not_found(request):
    from django.shortcuts import render_to_response
    response = render_to_response('404.html', {})
    response.status_code = 404
    return response

