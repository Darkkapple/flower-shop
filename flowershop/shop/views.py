from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
def home(request):
    return HttpResponse("<a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>Click me</a>")