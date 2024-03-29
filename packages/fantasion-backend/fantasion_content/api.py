from rest_framework.serializers import HyperlinkedModelSerializer
from rest_framework.viewsets import ReadOnlyModelViewSet

from fantasion_generics.api import PublicMediaSerializer, PublicInfoViewSet
from fantasion_generics.api import LocalPhotoSerializer, media_fields

from . import models


class FlavourTextSerializer(HyperlinkedModelSerializer):

    class Meta:
        model = models.FlavourText
        fields = ['id', 'text', 'quote_owner']


class FlavourTextView(ReadOnlyModelViewSet):
    queryset = models.FlavourText.objects.all()
    serializer_class = FlavourTextSerializer


class FrequentlyAskedQuestionMediaSerializer(PublicMediaSerializer):

    class Meta:
        model = models.FrequentlyAskedQuestionMedia
        fields = media_fields


class FrequentlyAskedQuestionSerializer(HyperlinkedModelSerializer):
    media = FrequentlyAskedQuestionMediaSerializer(many=True)

    class Meta:
        model = models.FrequentlyAskedQuestion
        fields = ('id', 'question', 'short_answer', 'detailed_answer', 'media')


class FrequentlyAskedQuestionView(PublicInfoViewSet):
    queryset = models.FrequentlyAskedQuestion.objects
    serializer_class = FrequentlyAskedQuestionSerializer


class StaticArticleMediaSerializer(PublicMediaSerializer):

    class Meta:
        model = models.StaticArticleMedia
        fields = media_fields


class StaticArticleSerializer(HyperlinkedModelSerializer):
    media = StaticArticleMediaSerializer(many=True)

    class Meta:
        model = models.StaticArticle
        fields = ['id', 'title', 'description', 'text', 'key', 'media']


class StaticArticleView(ReadOnlyModelViewSet):
    queryset = models.StaticArticle.objects.all()
    serializer_class = StaticArticleSerializer
    lookup_field = 'key'


class ProfileMediaSerializer(PublicMediaSerializer):

    class Meta:
        model = models.MonsterMedia
        fields = media_fields


class MonsterSerializer(HyperlinkedModelSerializer):
    avatar = LocalPhotoSerializer()
    media = ProfileMediaSerializer(many=True)

    class Meta:
        model = models.Monster
        fields = (
            'description',
            'id',
            'species',
            'avatar',
            'media',
            'text',
            'title',
        )


class MonsterCollection(PublicInfoViewSet):
    queryset = models.Monster.objects
    serializer_class = MonsterSerializer
