from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from fantasion_generics.visibility import (
    VISIBILITY_HIDDEN,
    VISIBILITY_PRIVATE,
    VISIBILITY_PUBLIC,
)

from .models import StaticArticle


class StaticArticleVisibilityTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.form_url = 'https://docs.google.com/forms/d/e/example/viewform'
        for key, visibility in (
            ('public-event', VISIBILITY_PUBLIC),
            ('private-event', VISIBILITY_PRIVATE),
            ('hidden-event', VISIBILITY_HIDDEN),
        ):
            StaticArticle.objects.create(
                key=key,
                title=key,
                text='Event details',
                visibility=visibility,
                signup_form_url=cls.form_url,
            )
        StaticArticle.objects.create(
            key='article-only',
            title='Article without a signup form',
            text='Article details',
            visibility=VISIBILITY_PUBLIC,
        )

    def get_article(self, key):
        return self.client.get(reverse('static_article-detail', kwargs={'key': key}))

    def test_public_article_includes_signup_embed(self):
        response = self.get_article('public-event')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['text'], 'Event details')
        self.assertEqual(
            response.json()['signupFormEmbedUrl'],
            f'{self.form_url}?embedded=true',
        )

    def test_article_without_signup_form_has_empty_embed(self):
        response = self.get_article('article-only')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['signupFormEmbedUrl'], '')

    def test_private_article_remains_accessible_by_direct_link(self):
        response = self.get_article('private-event')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_hidden_article_returns_not_found(self):
        response = self.get_article('hidden-event')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertNotIn('signupFormEmbedUrl', response.json())

    def test_hiding_a_public_article_unpublishes_it(self):
        self.assertEqual(self.get_article('public-event').status_code, status.HTTP_200_OK)
        StaticArticle.objects.filter(key='public-event').update(visibility=VISIBILITY_HIDDEN)

        response = self.get_article('public-event')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_missing_article_returns_not_found(self):
        response = self.get_article('missing-event')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_list_only_includes_public_articles(self):
        response = self.client.get(reverse('static_article-list'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertCountEqual(
            [article['key'] for article in response.json()['results']],
            ['public-event', 'article-only'],
        )
