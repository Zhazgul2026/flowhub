from rest_framework import serializers
from .models import WholesaleOrder, WholesaleRequest

class WholesaleOrderSerializer(serializers.ModelSerializer):
    buyer_username = serializers.ReadOnlyField(source='buyer.username')
    advert_title = serializers.ReadOnlyField(source='advert.title')

    class Meta:
        model = WholesaleOrder
        fields = ('id', 'advert', 'advert_title', 'buyer', 'buyer_username',
                  'quantity', 'total_price', 'prepayment_percent', 'status',
                  'escrow_status', 'buyer_message', 'seller_response', 'created_at', 'updated_at')
        read_only_fields = ('buyer', 'status', 'escrow_status')

    def create(self, validated_data):
        validated_data['buyer'] = self.context['request'].user
        return super().create(validated_data)

class WholesaleRequestSerializer(serializers.ModelSerializer):
    buyer_username = serializers.ReadOnlyField(source='buyer.username')
    advert_title = serializers.ReadOnlyField(source='advert.title')

    class Meta:
        model = WholesaleRequest
        fields = ('id', 'advert', 'advert_title', 'buyer', 'buyer_username',
                  'desired_quantity', 'message', 'is_responded', 'created_at')
        read_only_fields = ('buyer', 'is_responded')