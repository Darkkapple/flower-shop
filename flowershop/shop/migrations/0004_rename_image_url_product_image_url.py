# Generated by Django 5.0.6 on 2024-09-03 02:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0003_rename_image_url_product_image_url_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product',
            old_name='image_Url',
            new_name='image_url',
        ),
    ]
