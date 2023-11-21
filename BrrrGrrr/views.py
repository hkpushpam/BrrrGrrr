from django.shortcuts import render, redirect, HttpResponse
from django.contrib.auth import login, logout, authenticate
from django.utils import timezone
from django.contrib.auth.models import User
import json
from django.http import JsonResponse
from .models import *

def get_cost(req_materials):
    material_costs = []
    for item in req_materials:
        stock_item = Stock.objects.get(Materials=item)

        stock_item.Quantity -= 1
        stock_item.save()

        cost = stock_item.Price
        material_costs.append(cost)
    
    return material_costs

def insotck(req_materials):
    instock = True
    for item in req_materials:
        stock_item = Stock.objects.get(Materials=item)
        if(stock_item.Quantity<1):
            instock = False
    return instock


def ordersave(req_materials, user):
    save = False
    user_number = user.id
    current_time = timezone.now().time()
    new_order = Order(order_user=user_number, Time=current_time, items=req_materials)
    new_order.save()
    save = True
    
    return save

def get_username(uid):
    return User.objects.filter(id=uid).first()

# Create your views here.

def homepage_view(request):
    material_data = Stock.objects.filter(Quantity__gt=0)
    user = request.user
    if user.is_authenticated and not user.is_superuser:
        context = {
            'user' : user,
            'material_data': [{'material': item.Materials, 'quantity': item.Quantity, 'price': item.Price} for item in material_data],
        }
    if user.is_authenticated and user.is_superuser:
        return redirect('BrrrGrrr:orders')
    else:
        context = {
            'material_data': [{'material': item.Materials, 'quantity': item.Quantity, 'price': item.Price} for item in material_data],
        }
    return render(request, 'homepage.html', context)

def admin_view(request):
    user = request.user
    if user.is_authenticated and user.is_superuser:
        material_array = Stock.objects.all()
        order_array = Order.objects.all()
        isOldOrder = Order_History.objects.exists()
        context = {
            'material_data': [{'material': item.Materials, 'quantity': item.Quantity, 'price': item.Price} for item in material_array],
            'order_data': [{'Order_Id': item.id, 'Time': item.Time, 'Items': item.items } for item in order_array],
            'isOrderHistory': isOldOrder,
        }
        return render(request, 'admin.html', context)
    else:
        return redirect('BrrrGrrr:login')

def new_Worker_view(request):
    if request.user.is_authenticated and request.user.is_superuser:
        return render(request, 'new_user.html')
    else:
        return redirect('BrrrGrrr:login')

def signup_view(request):
    if request.method == 'POST':
        un = request.POST['username']
        psw = request.POST['pwd']
        email = request.POST['email']
        fn = request.POST['firName']
        ln = request.POST['lasName']
        try:
            user = User.objects.create_user(username=un, email=email, password=psw, first_name = fn, last_name = ln)
            login(request, user)
            return redirect('BrrrGrrr:homepage')
        except Exception as e:
            context={ 'error':f'Error creating account: {e}'}
            return render(request, 'login.html', context)   
    else:
        return render(request, 'login.html')

def login_view(request):
    if request.method == 'POST':
        un = request.POST['username']
        psw = request.POST['pwd']

        user = authenticate(request, username = un, password = psw)

        if user is not None:
            login(request, user)
            if user.is_superuser:
                return redirect('BrrrGrrr:orders')
            else:
                return redirect('BrrrGrrr:homepage')
        else:
            context={
                'error' : 'Invalid Username or Password'
            }
            return render(request, 'login.html', context)
    else:
        return render(request, 'login.html')


def log_out(request):
    logout(request)
    return redirect('BrrrGrrr:homepage')

def save_data(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        materials = data.get('Product')
        quantity = data.get('Quantity')
        price = data.get('Unit_Price')
        print(materials)
        print()
        if(materials is not None and quantity is not None and price is not None):
            existing_stock = Stock.objects.filter(Materials=materials).first()
            if existing_stock:
                # If a record with the same materials exists, update its quantity and price
                existing_stock.Quantity = quantity
                existing_stock.Price = price
                existing_stock.save()
            else:
                # If no record with the same materials exists, create a new Stock record
                Stock.objects.create(Materials=materials, Quantity=quantity, Price=price)
            return JsonResponse({'message': 'Data saved successfully!'})

    return JsonResponse({'error': 'Invalid request method.'}, status=400)

def receive_order(request):
    if request.user.is_authenticated and not request.user.is_superuser:
        if request.method == 'POST':
            data = request.POST.get('selected_materials')
            selected_materials = data.split(',') if data else []
            if(not insotck(selected_materials)):
                return redirect('BrrrGrrr:homepage')
            else:
                if(ordersave(selected_materials, request.user)):
                    price_required = get_cost(selected_materials)
                    materials_with_prices = []
                    for i in range(len(selected_materials)):
                        material_data = {
                            'material': selected_materials[i],
                            'price': price_required[i]
                        }
                        materials_with_prices.append(material_data)
                    context={
                        'user' : request.user,
                        'materials_with_prices' : materials_with_prices,
                    }
                    return render(request, 'Invoice.html', context)
                else:
                    return redirect('BrrrGrrr:homepage')
        else:
            return JsonResponse({'message': 'Invalid request method!'}, status=400)
    else:
        return redirect('BrrrGrrr:login')

def order_complete(request):
    if request.user.is_authenticated and request.user.is_superuser:
        if request.method == 'POST':
            data = json.loads(request.body)
            order_number = data.get('orderId')
            print(request)
            print(order_number)
            try:
                # Get the order details from the Order model
                order = Order.objects.get(pk=order_number)
                # Create a new entry in the Order_History model using the order details
                Order_History.objects.create(
                    order_user=get_username(order.order_user),
                    Time_Order=order.Time,
                    Time_finished=timezone.now(),
                    items=order.items
                )
                # Delete the order entry from the Order model
                order.delete()
                return JsonResponse({'success': True})
            except Order.DoesNotExist:
                # Handle if the order does not exist in the Order model
                return JsonResponse({'success': False, 'message': 'Order not found'}, status=404)
            except Exception as e:
                # Handle other exceptions or errors
                return JsonResponse({'success': False, 'message': str(e)}, status=500)

        return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=400)
    else:
        return redirect('BrrrGrrr:homepage')

def order_history(request):
    if request.user.is_authenticated and request.user.is_superuser:
        Order_History_array = Order_History.objects.all()
        context={
            'Order_history': Order_History_array,
        }
        return render(request, 'history.html', context)
    else:
        return redirect('BrrrGrrr:homepage')
