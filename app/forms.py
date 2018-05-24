# !usr/bin/env python
# -*- coding:utf-8 -*-
from django import forms


class RegisterForm(forms.Form):
    user_email = forms.EmailField(required=True)
    password1 = forms.CharField(required=True,min_length=6)
    password2 = forms.CharField(required=True, min_length=6)
    user_name = forms.CharField(required=True)


