import json
from django.db import IntegrityError
from django.http import Http404, HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render
from django.conf import settings
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import googlemaps

from complaints.models import Complaint, User

def index(request):
    
    return render(request, "complaints/index.html")

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "complaints/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "complaints/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "complaints/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "complaints/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "complaints/register.html")    

def add(request,_coordinates=None):
    
    if request.method == "POST":

        arr_coordinates = request.POST["coordinates"].split(",")
       
        _description = request.POST["description"]
        _latitude    = arr_coordinates[1]
        _longitude   = arr_coordinates[0]
        _photo       = request.POST["photo"]
        _danger      = request.POST["danger"]
        
        try:

            complaint = Complaint(
                description=_description,
                user=request.user,
                enabled=True,
                latitude=_latitude,
                longitude=_longitude,
                photo=_photo,
                danger=_danger
            )
            complaint.save()

        except IntegrityError:
            return render(request, "complaints/add.html", {
                "message": "Error saving."
            })

        return HttpResponseRedirect(reverse("index")) 
           
    else:  
        if (_coordinates==None):
            return HttpResponseRedirect(reverse("index"))             
        else:
            return render(request, "complaints/add.html", context={'coordinates':_coordinates}) 

def edit(request,_id=None):

    if request.method == "POST":

        _description = request.POST["description"]
        _photo       = request.POST["photo"]
        _danger      = request.POST["danger"]
        
        try:

            complaint = Complaint.objects.get(id=request.POST["id"])
            complaint.description = _description
            complaint.photo = _photo
            complaint.danger = _danger
            complaint.save()

        except IntegrityError:
            return render(request, "complaints/edit.html", {
                "message": "Error saving."
            })

        return HttpResponseRedirect(reverse("index")) 
    
    else:

        if (_id==None):
            return HttpResponseRedirect(reverse("index"))             
        else:
            try:
                complaint = Complaint.objects.get(id=_id)
                return render(request, "complaints/edit.html", context={'id':_id, 'complaint':complaint}) 

            except Complaint.DoesNotExist:
                 raise Http404("Complaint Not Found.");                           

@csrf_exempt
def complaint(request, _id=None):
    
    if request.method == "POST" and request.user.is_authenticated:
        
        return JsonResponse({"error": "Method POST no allowed."}, status=404)

    if request.method == "PATCH" and request.user.is_authenticated:

        return JsonResponse({"error": "Method PATCH no allowed."}, status=404)

    if request.method == "PUT" and request.user.is_authenticated:

        if not request.user.is_authenticated :
           return JsonResponse({"error": "Login Required."}, status=404)

        data = json.loads(request.body)

        _enabled = data.get("enabled", "")
        _delete = data.get("delete", "")
      
        user_logged = request.user

        complaint = Complaint.objects.get(id=_id)

        if complaint.user != user_logged:
            return JsonResponse({
                "error": "Invalid user."
            }, status=400)  
        
        if (_delete == False):        
            complaint.enabled = _enabled
            complaint.save()
        else:
            complaint.delete()
                  
        return JsonResponse({"message": "Complaint altered"}, status=201) 

    if request.method == "GET":

        try:
            if (_id==None):
                complaint = Complaint.objects.filter(enabled=True)      
            else:
                complaint = Complaint.objects.filter(id=_id)           
        except Complaint.DoesNotExist:
            return JsonResponse({"error": "Complaints not found."}, status=404)
        
        return JsonResponse({"complaint":[obj.serialize() for obj in complaint],                            
                             "user_auth": request.user.username}, safe=False)