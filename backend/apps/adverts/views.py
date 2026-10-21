    def perform_create(self, serializer):
        user = self.request.user
        category_id = self.request.data.get('category')
        
        # Проверяем, есть ли уже объявление в этой категории за этот месяц
        first_day_of_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        existing_count = Advert.objects.filter(
            user=user,
            category_id=category_id,
            created_at__gte=first_day_of_month,
            status__in=['active', 'moderation'] # Если удалил отклоненное, лимит не тратится
        ).count()

        if existing_count >= 1:
            raise PermissionDenied(
                'В этой категории у вас уже есть объявление в этом месяце. '
                'Бесплатно можно подать только 1 объявление в месяц в каждой категории.'
            )

        expires_at = timezone.now() + timedelta(days=30)
        serializer.save(user=user, expires_at=expires_at)