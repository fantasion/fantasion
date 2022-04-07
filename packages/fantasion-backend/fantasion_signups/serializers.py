from rest_framework.serializers import ModelSerializer

from . import models
from fantasion_people.models import Family
from fantasion_expeditions.models import (
    AgeGroup,
    Expedition,
    ExpeditionBatch,
    Troop,
)


class ParticipantSerializer(ModelSerializer):
    class Meta:
        model = models.Participant
        fields = (
            'id',
            'family',
            'first_name',
            'last_name',
            'birthdate',
        )
        read_only_fields = ('family',)


    def get_or_create_family(self):
        user = self.context.get('request').user
        family = user.families.first()
        if not family:
            family = Family(owner=user, title=f"{user.get_full_name()} Family")
            family.save()
        return family


    def create(self, validated_data):
        inst = models.Participant(
            **validated_data,
            family=self.get_or_create_family(),
        )
        inst.save()
        return inst

    def update(self, instance, data):
        instance.birthday = data.get('birthday', instance.birthday)
        instance.first_name = data.get('first_name', instance.first_name)
        instance.last_name = data.get('last_name', instance.last_name)
        instance.save()
        return instance


class AgeGroupSerializer(ModelSerializer):
    class Meta:
        model = AgeGroup
        fields = (
            "age_max",
            "age_min",
            "id",
            "title",
        )


class ExpeditionSerializer(ModelSerializer):
    class Meta:
        model = Expedition
        fields = (
            "id",
            "title",
        )


class BatchSerializer(ModelSerializer):
    expedition = ExpeditionSerializer()

    class Meta:
        model = ExpeditionBatch
        fields = (
            "id",
            "expedition",
        )


class TroopSerializer(ModelSerializer):
    age_group = AgeGroupSerializer()
    batch = BatchSerializer()

    class Meta:
        model = Troop
        fields = (
            "age_group",
            "ends_at",
            "id",
            "batch",
            "program",
            "starts_at",
        )


class SignupSerializer(ModelSerializer):
    participant = ParticipantSerializer()
    troop = TroopSerializer()

    class Meta:
        model = models.Signup
        fields = (
            'id',
            'note',
            'participant',
            'price',
            'product_type',
            'status',
            'troop',
        )
        read_only_fields = ('id', 'product_type', 'price', 'status')


    def get_or_create_order(self, order_id):
        user = self.context.get('request').user
        order = None
        if order_id:
            order = eshop.Order.objects.filter(
                owner=user,
                order_id=order_id,
                status=models.ORDER_STATUS_NEW
            ).first()
        else:
            order = eshop.Order.objects.filter(
                owner=user,
                status=models.ORDER_STATUS_NEW
            ).first()
        
        if not order:
            order = eshop.Order(owner=user)
            order.save()
        return order


    def create(self, data):
        order = self.get_or_create_order(data.get('order_id', None))
        participant = Participant.objects.get(pk=data.get('participant_id'))
        troop = Troop.objects.get(pk=data.get('troop_id'))
        inst = models.Signup(
            **validated_data,
            family=participant.family,
            legal_guardian=data.get('legal_guardian'),
            note=data.get('note'),
            order=self.get_or_create_order(),
            participant=participant,
            troop=troop,
        )
        inst.save()
        return inst
