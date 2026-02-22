from rest_framework.test import APITestCase
from rest_framework import status
from accounts.models import User


class LoginTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="admin@example.com", password="admin12345")

    def test_login_returns_token(self):
        res = self.client.post(
            "/api/login/",
            {"email": "admin@example.com", "password": "admin12345"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("token", res.data)
