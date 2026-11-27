# backend/task/migrations/0002_alter_task_create_alter_task_task_case_and_more.py
#
# FIX (round 2): previously depended on ('case', '0002_...') and
# ('source', '0002_...') — migrations generated INSIDE the container by the
# entrypoint and never copied back to the repo. After a volume wipe they are
# regenerated with potentially different names, causing NodeNotFoundError.
# These AlterField operations don't need cross-app parents on a fresh DB.

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('task', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='create',
            field=models.DateTimeField(auto_now_add=True, null=True, verbose_name='date published'),
        ),
        migrations.AlterField(
            model_name='task',
            name='task_case',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='case.case'),
        ),
        migrations.AlterField(
            model_name='task',
            name='task_src',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='source.source'),
        ),
    ]
