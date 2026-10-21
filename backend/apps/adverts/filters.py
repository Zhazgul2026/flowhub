import django_filters
from django.db.models import Q
from .models import Advert


class AdvertFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='filter_search')
    price_min = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    brand = django_filters.CharFilter(method='filter_category_field')
    model = django_filters.CharFilter(method='filter_category_field')
    year_min = django_filters.NumberFilter(method='filter_year_min')
    year_max = django_filters.NumberFilter(method='filter_year_max')
    
    # Фильтр по городу (iexact - без учета регистра)
    city = django_filters.CharFilter(lookup_expr='iexact')

    class Meta:
        model = Advert
        fields = ['category', 'is_wholesale', 'city'] # <-- добавили city

    def filter_search(self, queryset, name, value):
        if not value:
            return queryset
        return queryset.filter(Q(title__icontains=value) | Q(description__icontains=value))

    def filter_category_field(self, queryset, name, value):
        if not value:
            return queryset
        return queryset.filter(**{f'category_fields__{name}': value})

    def filter_year_min(self, queryset, name, value):
        if not value:
            return queryset
        return queryset.filter(category_fields__year__gte=str(value))

    def filter_year_max(self, queryset, name, value):
        if not value:
            return queryset
        return queryset.filter(category_fields__year__lte=str(value))