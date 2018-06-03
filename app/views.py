from django.db.models import Q
from django.contrib.auth.backends import ModelBackend
from django.shortcuts import render
from django.views.generic.base import View
from .models import UserProfile,UserTodo
from .forms import RegisterForm,LoginForm
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate,login,logout
from django.urls import reverse
from django.http import HttpResponse,HttpResponsePermanentRedirect,HttpResponseRedirect
from django.forms.models import model_to_dict
import re
from datetime import datetime

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
        return render(request, 'login.html')
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
                    return HttpResponseRedirect(reverse('main'))
            return render(request, 'login.html', {'msg': '用户名或密码错误!'})
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


#用户登陆以后显示的main页面
class MainView(View):
    def get(self,request):
        user_email = UserProfile.objects.get(username=request.user)  #注意打印出的是用户名
        user_memo = user_email.memo
        todo_query = UserTodo.objects.filter(user_email=user_email,done=False)
        todo_query = todo_query.order_by("deadline") #按照截至日期按照从小到大的顺序进行筛选
        # todo_query = todo_query.order_by("-deadline")  按照截至日期按照从大到小的顺序进行筛选
        todo_dict = todo_query.values("ToDolist").values("ToDolist")
        todo_list = []
        for todo in todo_dict:
            todo_list.append(todo["ToDolist"])
            '''
        time_dict = todo_query.values("deadline").values("deadline")
        time_list = []
        for time in time_dict[0:5]:
            buff_time = str(time["deadline"])
            pat = '[0-9]+'
            buff_time = re.findall(pat,buff_time)
            buff_time = buff_time[0]+'年'+buff_time[1]+'月'+buff_time[2]+'日'+buff_time[3]+'时'+buff_time[4]+'分'
            time_list.append(buff_time)
            '''
        para = {'todo_list':todo_list,'memo':user_memo}
        #para_time = {'time0':time_list[0],'time1':time_list[1],'time2':time_list[2],'time3':time_list[3],'memo':user_memo}
        #para = dict(para_todo,**para_time) #将两个字典连接到一块
        return render(request,'main2.html',para)
    def post(self,request):
        psss
        return render(request, 'main2.html')

class Person_info(View):
    def get(self,request):
        return render(request,'person_info.html')
    def post(self,request):
        '''
        用户提交修改个人信息
        :param request:
        :return:
        '''
        pass
#全局404 函数
def page_not_found(request):
    from django.shortcuts import render_to_response
    response = render_to_response('404.html', {})
    response.status_code = 404
    return response

#全局500 函数
def page_error(request):
    from django.shortcuts import render_to_response
    response = render_to_response('500.html', {})
    response.status_code = 500
    return response


#将用户添加的todo保存到数据库中,加装饰符为了防止csrf对其进行拦截
@csrf_exempt
def save_todo(request):
    if request.method == 'POST':
        user_email = UserProfile.objects.get(username=request.user)
        memo = ''
        done = False
        try:
            todo = request.POST.get('todo')#获取从后端返回的数据
            if todo is not None:
                user_todo = UserTodo(ToDolist=todo,done=done,user_email=user_email,deadline=datetime.now())
                user_todo.save()
        except Exception as e:
            print(e)


#用户点击右侧的X号，对todo进行隐藏 暂且不用
@csrf_exempt
def save_hide_todo(request):
    if request.method == 'POST':
        user_email = UserProfile.objects.get(username=request.user) #获取当前登陆用户的todo id
        time_query = UserTodo.objects.filter(user_email=user_email, done=False)
        time_query = time_query.order_by("deadline")  # 按照截至日期按照从小到大的顺序进行筛选
        time_dict = time_query.values("deadline").values("deadline")
        try:
            id = int(request.POST.get('id'))
            time_index = time_dict[id]['deadline'] #获取用户点击隐藏的那一条的deadline,一般来讲用户的deadline是不可能有重复的
            User = UserTodo.objects.get(user_email=user_email,deadline=time_index)
            #User = User.filter(deadline=time_index)
            User.done = True
            User.save()
        except Exception as e:
            print(e)

#将用户添加的todo保存到数据库中,加装饰符为了防止csrf对其进行拦截
@csrf_exempt
def save_memo(request):
    if request.method == 'POST':
        try:
            memo = request.POST.get('memo')#获取从后端返回的数据
            user_profile = UserProfile.objects.get(username=request.user)
            user_profile.memo = memo
            user_profile.save()
        except Exception as e:
            print(e)