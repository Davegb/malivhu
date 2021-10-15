from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('submit', views.submit, name='submit'),
    path('help', views.help, name='help'),
    path('<int:jobId>', views.results, name='results'),
    path('<int:jobId>/2/<str:protein>', views.secondaryStructure, name='secondaryStructure'),
    path('<int:jobId>/3/<str:protein>', views.tertiaryStructure, name='tertiaryStructure'),
    path('<int:jobId>/predict/2', views.predictSecondary, name='predictSecondary'),
    path('<int:jobId>/predict/3', views.predictTertiary, name='predictTertiary'),
    path('<int:jobId>/checkProgress', views.checkProgress, name='checkProgress'),
    path('checkJob', views.checkJob, name='checkJob'),
    path('checkJob4', views.checkJob4, name='checkJob4'),
    path('<int:jobId>/submitPhase4', views.submitPhase4, name='submitPhase4'),
]