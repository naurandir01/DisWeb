# Generated by Django 5.1.4 on 2025-06-21 13:09

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('case', '0001_initial'),
        ('django_celery_results', '0011_taskresult_periodic_task_name'),
        ('source', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExtendedTaskResult',
            fields=[
                ('task_resulst', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='django_celery_results.taskresult')),
                ('task_type', models.TextField(null=True)),
                ('task_case', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='case.case')),
                ('task_source', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='source.source')),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id_task', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('create', models.DateTimeField(null=True, verbose_name='date published')),
                ('task_type', models.TextField(null=True)),
                ('task_status', models.CharField(max_length=250, null=True)),
                ('task_case', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='case.case')),
                ('task_src', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='source.source')),
            ],
        ),
    ]
