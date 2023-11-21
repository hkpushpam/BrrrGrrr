from django.urls import path
from . import views

app_name = 'BrrrGrrr'

urlpatterns = [
    # Add path here
    path(route='', view=views.homepage_view, name='homepage'),
    path(route='login', view=views.login_view, name='login'),
    path(route='login/', view=views.login_view, name='login'),
    path(route='signup/', view=views.signup_view, name='signup'),
    path(route='signup', view=views.signup_view, name='signup'),
    path(route='orders/', view=views.admin_view, name='orders'),
    path(route='orders', view=views.admin_view, name='orders'),
    path(route='receive_order/', view=views.receive_order, name='receive'),
    path(route='receive_order', view=views.receive_order, name='receive'),
    path(route='new_worker/', view=views.new_Worker_view, name='new'),
    path(route='new_worker', view=views.new_Worker_view, name='new'),
    path(route='logout/', view=views.log_out, name='logout'),
    path(route='logout', view=views.log_out, name='logout'),
    path(route='save/', view=views.save_data, name='save_data'),
    path(route='save', view=views.save_data, name='save_data'),
    path(route='order_complete/', view=views.order_complete, name='order_complete'),
    path(route='order_complete', view=views.order_complete, name='order_complete'),
    path(route='order_history/', view=views.order_history, name='history'),
    path(route='order_history', view=views.order_history, name='history'),
]