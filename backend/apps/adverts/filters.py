import django_filters
from .models import Advert


class AdvertFilter(django_filters.FilterSet):
    # Поиск по названию и описанию (icontains — регистронезависимо)
    search = django_filters.CharFilter(method='filter_search')

    # Цена от/до
    price_min = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name='price', lookup_expr='lte')

    # Фильтр по характеристикам (category_fields JSON)
    # Например: /api/adverts/?brand=Toyota&year_min=2020
    brand = django_filters.CharFilter(method='filter_category_field')
    model = django_filters.CharFilter(method='filter_category_field')
    year_min = django_filters.NumberFilter(method='filter_year_min')
    year_max = django_filters.NumberFilter(method='filter_year_max')

    class Meta:
        model = Advert
        fields = ['category', 'is_wholesale']

    def filter_search(self, queryset, name, value):
        """Поиск по title и description."""
        if not value:
            return queryset
        return queryset.filter(
            django_filters.utils.Q(title__icontains=value) |
            django_filters.utils.Q(description__icontains=value)
        )

    def filter_category_field(self, queryset, name, value):
        """Фильтр по произвольному полю из JSON category_fields."""
        if not value:
            return queryset
        # В PostgreSQL: category_fields->>'brand' = 'Toyota'
        # В SQLite работает через json_extract
        return queryset.filter(**{f'category_fields__{name}': value})

    def filter_year_min(self, queryset, name, value):
        """Год выпуска >= value (значение хранится строкой в JSON)."""
        if not value:
            return queryset
        return queryset.filter(
            category_fields__year__gte=str(value)
        ).extra(
            where=["CAST(json_extract(category_fields, '$.year') AS INTEGER) >= %s"],
            params=[value],
        )

    def filter_year_max(self, queryset, name, value):
        """Год выпуска <= value."""
        if not value:
            return queryset
        return queryset.filter(
            category_fields__year__lte=str(value)
        ).extra(
            where=["CAST(json_extract(category_fields, '$.year') AS INTEGER) <= %s"],
            params=[value],
        )