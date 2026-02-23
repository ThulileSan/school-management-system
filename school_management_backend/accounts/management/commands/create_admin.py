from django.core.management.base import BaseCommand
from accounts.models import User


class Command(BaseCommand):
    help = 'Create admin user if it does not exist'

    def handle(self, *args, **options):
        email = 'thulile.d.sibiya@gmail.com'
        password = 'Dlmfun01'
        
        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING(f'Admin user {email} already exists'))
        else:
            User.objects.create_superuser(email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f'Admin user {email} created successfully'))
