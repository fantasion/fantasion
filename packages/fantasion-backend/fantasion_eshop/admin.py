from django.shortcuts import redirect, get_object_or_404
from django.urls import path, reverse
from fantasion_generics.admin import BaseAdmin, TranslatedAdmin
from fantasion_generics.filters import YearFilter
from fantasion_signups.models import Signup
from nested_admin import NestedStackedInline

from . import models


class OrderYearFilter(YearFilter):
    filter_fields = ['submitted_at']
    current = True


class ProductPriceYearFilter(YearFilter):
    filter_fields = ('available_since', 'available_until')
    current = True


class PromotionCodeYearFilter(YearFilter):
    filter_fields = ('valid_from', 'valid_until')
    current = True


class OrderSignupAdmin(NestedStackedInline):
    model = Signup
    extra = 0
    fields = (
        'family',
        'participant',
        'troop',
        'product_price',
        'price',
        'status',
        'legal_guardian',
        'note',
        'cancelled_for',
    )
    add_fields = (
        'family',
        'participant',
        'troop',
        'product_price',
        'price',
        'legal_guardian',
        'note',
    )
    autocomplete_fields = (
        'troop',
        'family',
        'participant',
        'product_price',
    )

    def get_fields(self, request, obj=None):
        if not obj:
            return self.add_fields
        return super().get_fields(request, obj)


class OrderPromotionCodeAdmin(NestedStackedInline):
    model = models.OrderPromotionCode
    extra = 0
    autocomplete_fields = ('promotion_code', )
    readonly_fields = ('price', )
    fields = (
        'promotion_code',
        'price',
    )
    add_fields = ('promotion_code', )

    def get_fields(self, request, obj=None):
        if not obj:
            return self.add_fields
        return super().get_fields(request, obj)


class OrderInvoiceAddressAdmin(BaseAdmin):
    model = models.OrderInvoiceAddress
    list_display = ('city', 'street', 'street_number', 'postal_code', 'user')
    search_fields = (
        'user__last_name',
        'user__first_name',
        'street',
        'city',
        'street_number',
        'postal_code',
    )


class OrderAdmin(BaseAdmin):
    model = models.Order
    change_form_template = 'admin/order_change_form.html'
    inlines = (OrderSignupAdmin, OrderPromotionCodeAdmin)
    list_display = (
        'id',
        'price',
        'status',
        'request_insurance',
        'owner',
        'created',
    )
    list_filter = (
        OrderYearFilter,
        'status',
    )
    search_fields = (
        'pk',
        'promise__variable_symbol',
        'owner__first_name',
        'owner__last_name',
    )
    autocomplete_fields = ('owner', 'invoice_address')
    readonly_fields = (
        'deposit',
        'get_surcharge',
        'price',
        'promise',
    )
    fields_add = (
        'owner',
        'use_deposit_payment',
        'request_insurance',
    )
    fields_edit = (
        'owner',
        'invoice_address',
        'status',
        'promise',
        'use_deposit_payment',
        'request_insurance',
        'deposit',
        'get_surcharge',
        'price',
    )

    def get_fields(self, request, obj=None):
        if not obj:
            return self.fields_add
        return self.fields_edit

    def get_urls(self):
        return super().get_urls() + [
            path(
                '<int:order_id>/preview-invoice',
                self.admin_site.admin_view(self.preview_invoice),
                name='order_preview_invoice',
            ),
        ]

    def preview_invoice(self, request, order_id=None):
        order = get_object_or_404(
            models.Order,
            pk=order_id,
        )
        return redirect(
            reverse('orders-invoice',
                    kwargs={
                        "format": "html",
                        "pk": order.id,
                    }))


class PriceLevelAdmin(TranslatedAdmin):
    model = models.PriceLevel
    list_display = (
        'title',
        'enabled',
    )


class PromotionCodeAdmin(BaseAdmin):
    model = models.PromotionCode
    list_display = (
        'code',
        'max_usages',
        'enabled',
        'valid_from',
        'valid_until',
    )
    list_filter = (
        PromotionCodeYearFilter,
        'enabled',
    )
    search_fields = ('code', )


class ProductPriceAdmin(BaseAdmin):
    model = models.ProductPrice
    extra = 0
    list_filter = (ProductPriceYearFilter, 'price_level')
    search_fields = ('product__description', 'price_level__title')
    list_display = (
        'product',
        'price_level',
        'price',
        'available_since',
        'available_until',
    )
