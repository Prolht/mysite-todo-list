# !usr/bin/env python
# -*- coding:utf-8 -*-
from django.conf.urls import include
from . import views
from django.urls import path

urlpatterns = [
    path(r'^$',views.index,name='index'),
    path(r'^register/$',views.register,name='register'),
    path(r'^login/$',views.log_out,name='logout'),
    path(r'^(?P<article_id>[0-9]+)/comment/$',views.comment,name='comment'),
    path(r'^(?P<article_id>[0-9]+)/keep/$',views.get_keep,name='keep'),
    path(r'^(?P<article_id>[0-9]+)/poll/$',views.get_poll_article,name='poll'),
    path(r'^(?P<article_id>[0-9]+)/$',views.article,name='article'),

]
if __name__ == '__main__':
    pass