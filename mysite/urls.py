"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from app.views import RegisterView,LoginView
from django.contrib import admin
from django.urls import path
from app import testdb
from app import views

urlpatterns = [
    path('register/',RegisterView.as_view(),name='register'),
    path('admin/', admin.site.urls),
    path('login/', LoginView.as_view(),name='login'),
    path('index/',views.index),
    path('main/',views.main),
]
"""
  path('admin/', admin.site.urls),
  
  path('index/',views.index),
  path('main/',views.main),
  """