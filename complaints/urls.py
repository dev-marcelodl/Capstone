from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("add/", views.add, name="add"),
    path("add/<str:_coordinates>", views.add, name="add"),
    path("edit/", views.edit, name="edit"),
    path("edit/<str:_id>", views.edit, name="edit"),

    # API Routes
    path("complaint/", views.complaint, name="complaint"),
    path("complaint/<str:_id>", views.complaint, name="complaint")
]
