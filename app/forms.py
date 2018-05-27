# !usr/bin/env python
# -*- coding:utf-8 -*-
from django import forms


class RegisterForm(forms.Form):
    user_email = forms.EmailField(required=True)
    password1 = forms.CharField(required=True,min_length=6)
    password2 = forms.CharField(required=True, min_length=6)
    user_name = forms.CharField(required=True)

class LoginForm(forms.Form):
    username = forms.CharField(required=True,error_messages={'required':'用户名不能为空',})
    password = forms.CharField(required=True,error_messages={'required':'密码不能为空',})

class TodoForm(forms.Form):
    todo = forms.Textarea() #todoform表
    memo = forms.Textarea()

    ''''
    
    states = forms.IntegerField()
    created_time = forms.DateField()
    done = forms.BooleanField()
    '''