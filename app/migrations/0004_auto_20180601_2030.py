# Generated by Django 2.0.5 on 2018-06-01 20:30

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_auto_20180601_2027'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usertodo',
            name='deadline',
            field=models.DateTimeField(default=datetime.datetime(2018, 6, 1, 20, 30, 35, 228194), verbose_name='截至时间'),
        ),
    ]
