# !usr/bin/env python
# -*- coding:utf-8 -*-
from django import forms
from .models import UserInfo

class RegisterForm(forms.Form):
    email = forms.EmailField(required=True,
                             error_messages={'required': u'邮箱不能为空','invalid': u'请检查邮箱格式'})
    password = forms.CharField(required=True,min_length=6,error_messages={'required':'密码不能为空'})
    username = forms.CharField(required=True,error_messages={'required':'用户名不能为空'})


if __name__ == '__main__':
    pass