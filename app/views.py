from django.shortcuts import render
from django.shortcuts import HttpResponse
#业务处理逻辑的编写
# Create your views here.

def index(request):
    pass

def login(request):
    return render(request,'login.html')

