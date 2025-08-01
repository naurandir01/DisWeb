# Generated by Django 5.1.4 on 2025-06-21 13:09

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('case', '0001_initial'),
        ('source', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='IOCType',
            fields=[
                ('id_ioctype', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('ioctype_value', models.CharField(max_length=250, null=True)),
                ('ioctype_description', models.CharField(max_length=250, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='IOC',
            fields=[
                ('id_ioc', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('ioc_value', models.CharField(max_length=500, null=True)),
                ('ioc_case', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='case.case')),
                ('ioc_src', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='source.source')),
                ('ioc_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ioc.ioctype')),
            ],
        ),
    ]
