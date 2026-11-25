from django.urls import path

from wholesale import views

urlpatterns = [
    path("catalog/", views.catalog, name="catalog"),
    path("catalog/<slug:sku>/", views.product_detail, name="product"),
    path("shipping/", views.shipping, name="shipping"),
    path("credit/", views.credit, name="credit"),
    path("app/", views.app_home, name="app_home"),
    path("app/account/", views.account, name="account"),
    path("app/users/", views.users, name="company_users"),
    path("app/billing/", views.billing, name="billing"),
    path("app/credit/", views.app_credit, name="app_credit"),
    path("app/orders/", views.orders, name="orders"),
    path("app/orders/<slug:number>/", views.order_detail, name="order_detail"),
    path("app/invoices/", views.invoices, name="invoices"),
    path("app/quick-order/", views.quick_order, name="quick_order"),
    path("app/cart/", views.cart, name="cart"),
    path("desk/", views.desk, name="desk"),
    path("desk/customers/", views.desk_customers, name="desk_customers"),
    path("desk/customers/<slug:slug>/", views.desk_customer, name="desk_customer"),
    path("desk/credit/", views.desk_credit, name="desk_credit"),
    path("desk/products/", views.desk_products, name="desk_products"),
    path("desk/products/<slug:sku>/", views.desk_product, name="desk_product"),
    path("desk/orders/", views.desk_orders, name="desk_orders"),
    path("desk/orders/<slug:number>/status/", views.desk_order_status, name="desk_order_status"),
    path("desk/invoices/", views.desk_invoices, name="desk_invoices"),
    path("desk/invoices/<slug:number>/", views.desk_invoice, name="desk_invoice"),
    path("desk/roles/", views.desk_roles, name="desk_roles"),
]
