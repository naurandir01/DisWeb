# Generated by Django 5.1.4 on 2025-06-04 21:49

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='YaraRule',
            fields=[
                ('id_yararule', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('yararule_path', models.TextField(null=True)),
                ('yararule_name', models.CharField(null=True)),
                ('yararule_description', models.CharField(null=True)),
            ],
        ),
    ]
