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
from app.views import RegisterView,LoginView,LogoutView,IndexView,MainView,Person_info
from django.contrib import admin
from django.conf.urls import url
from app import testdb,views
import app
from django.conf import settings
from django.views.static import serve

urlpatterns = [
    # 基于函数 的 View 映射 URL 方法
    #path('register/',RegisterView.as_view(),name='register'),
    url(r'^admin/', admin.site.urls),
    url(r'^login/$', LoginView.as_view(),name='login'),
    url(r'^register/$',RegisterView.as_view(),name='register'),
    url(r'^main/$',MainView.as_view(),name='main'),
    url(r'^person_info/$',Person_info.as_view(),name='person_info'),
    url(r'^logout/',LogoutView.as_view(),name='logout1'),
    url(r'^save_todo/$',views.save_todo),
    url(r'^save_memo/$',views.save_memo),
    url(r'^save_hide_todo/$',views.save_hide_todo),
    url(r'^$',IndexView.as_view(),name='index'),
    url(r'^page_not_found',views.page_not_found),
]
# 全局 404 页面配置（django 会自动调用这个变量）
handler404 = 'app.views.page_not_found'
"""
if settings.DEBUG:
    # debug_toolbar 插件配置
    import debug_toolbar
    urlpatterns.append(url(r'^__debug__/', include(debug_toolbar.urls)))
else:
    # 项目部署上线时使用
    from mysite.settings import STATIC_ROOT
    # 配置静态文件访问处理
    urlpatterns.append(url(r'^static/(?P<path>.*)$', serve, {'document_root': STATIC_ROOT}))
"""