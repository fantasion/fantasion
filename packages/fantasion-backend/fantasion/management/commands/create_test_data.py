"""
Django management command to populate Fantasion database with
comprehensive test data including photos.

Run with:
  pnpm run create-test-data
Or:
  uv run python ./manage.py create_test_data
"""
from django.core.management.base import BaseCommand
import random
from datetime import datetime, timedelta, date
from decimal import Decimal
from django.core.files.base import ContentFile
from django.contrib.auth import get_user_model
from django.utils import timezone
from moneyed import CZK, Money

from fantasion_people.models import (
    Profile, Family, FamilyMember, Allergy, Diet, Hobby,
    FAMILY_ROLE_SPECTATOR
)
from fantasion_signups.models import (
    Participant, ParticipantAllergy, ParticipantDiet, ParticipantHobby,
    Signup, SignupDocumentType, SIGNUP_STATUS_NEW, SIGNUP_STATUS_CONFIRMED,
    SIGNUP_STATUS_ACTIVE
)
from fantasion_expeditions.models import (
    LeisureCentre, ExpeditionTheme, Expedition, ExpeditionBatch,
    AgeGroup, ExpeditionProgram, Troop, StaffRole, BatchStaff,
    TransportVehicle, Transport, TroopTransport,
    TRANSPORT_DIRECTION_THERE, TRANSPORT_DIRECTION_BACK,
    TRANSPORT_PLANNED
)
from fantasion_eshop.models import (
    PriceLevel, ProductPrice, Order, PromotionCode,
    ORDER_STATUS_NEW, ORDER_STATUS_PAID
)
from fantasion_locations.models import Country, Location
from fantasion_content.models import (
    FlavourText, FrequentlyAskedQuestion, StaticArticle, Monster
)
from fantasion_banking.models import Promise

User = get_user_model()

# Test password - change in production!
TEST_PASSWORD = 'testpass123'


def create_test_image(width=800, height=600, color='blue', text=''):
    """Create a simple colored test image with PIL"""
    try:
        from PIL import Image, ImageDraw, ImageFont
        import io

        img = Image.new('RGB', (width, height), color=color)
        draw = ImageDraw.Draw(img)

        if text:
            font_size = 40
            try:
                font_path = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
                font = ImageFont.truetype(font_path, font_size)
            except Exception:
                font = ImageFont.load_default()

            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]

            position = ((width - text_width) // 2, (height - text_height) // 2)
            draw.text(position, text, fill='white', font=font)

        buffer = io.BytesIO()
        img.save(buffer, format='JPEG')
        buffer.seek(0)
        filename = f'{text.lower().replace(" ", "_")}.jpg'
        return ContentFile(buffer.read(), name=filename)
    except ImportError:
        print("⚠️  PIL/Pillow not installed - skipping photo generation")
        print("    Install with: uv add pillow")
        return None


def clear_existing_data():
    """Clear existing test data (careful in production!)"""
    print("🗑️  Clearing existing test data...")

    Signup.objects.all().delete()
    Order.objects.all().delete()
    Promise.objects.all().delete()
    Participant.objects.all().delete()
    FamilyMember.objects.all().delete()
    Family.objects.all().delete()
    Troop.objects.all().delete()
    ExpeditionBatch.objects.all().delete()
    Expedition.objects.all().delete()
    BatchStaff.objects.all().delete()
    Profile.objects.all().delete()
    Transport.objects.all().delete()
    User.objects.filter(is_superuser=False).delete()

    print("✅ Cleared existing test data")


def create_locations():
    """Create locations for venues and addresses"""
    print("📍 Creating locations...")

    country, _ = Country.objects.get_or_create(
        code='CZ',
        defaults={'name': 'Česká republika'}
    )

    locations = []
    venues = [
        {'name': 'Tábořiště U Lesa', 'city': 'Příbram',
         'street': 'Lesní', 'street_number': '42'},
        {'name': 'Rekreační středisko Sluníčko', 'city': 'Tábor',
         'street': 'Slunečná', 'street_number': '123'},
        {'name': 'Chatová osada Medvěd', 'city': 'Beroun',
         'street': 'Medvědí', 'street_number': '7'},
    ]

    for venue_data in venues:
        loc, _ = Location.objects.get_or_create(
            name=venue_data['name'],
            defaults={
                'city': venue_data['city'],
                'street': venue_data['street'],
                'street_number': venue_data['street_number'],
                'postal_code': f'{random.randint(100, 999)} {random.randint(10, 99)}',
                'country': country,
                'lat': Decimal(f'50.{random.randint(0, 9)}'),
                'lng': Decimal(f'14.{random.randint(0, 9)}'),
            }
        )
        locations.append(loc)

    prague, _ = Location.objects.get_or_create(
        name='Praha - Hlavní nádraží',
        defaults={
            'city': 'Praha',
            'street': 'Wilsonova',
            'street_number': '8',
            'postal_code': '120 00',
            'country': country,
            'lat': Decimal('50.0835'),
            'lng': Decimal('14.4341'),
        }
    )
    locations.append(prague)

    print(f"✅ Created {len(locations)} locations")
    return locations


def create_lookups():
    """Create lookup tables (allergies, diets, hobbies, etc.)"""
    print("📋 Creating lookup tables...")

    allergy_names = ['Ořechy', 'Mléko', 'Lepek', 'Vejce', 'Ryby', 'Sója']
    allergies = [Allergy.objects.get_or_create(title=name)[0] for name in allergy_names]

    diet_names = ['Vegetariánská', 'Veganská', 'Bezlepková', 'Bez laktózy']
    diets = [Diet.objects.get_or_create(title=name)[0] for name in diet_names]

    hobby_names = ['Fotbal', 'Kreslení', 'Čtení', 'Hudba', 'Lezení', 'Programování', 'Šachy']
    hobbies = [Hobby.objects.get_or_create(title=name)[0] for name in hobby_names]

    role_names = ['Hlavní vedoucí', 'Vedoucí', 'Instruktor', 'Zdravotník', 'Kuchař']
    staff_roles = [StaffRole.objects.get_or_create(title=name)[0] for name in role_names]

    age_groups_data = [
        {'title': 'Mladší', 'age_min': 6, 'age_max': 9},
        {'title': 'Střední', 'age_min': 10, 'age_max': 12},
        {'title': 'Starší', 'age_min': 13, 'age_max': 15},
    ]
    age_groups = []
    for ag_data in age_groups_data:
        ag, _ = AgeGroup.objects.get_or_create(
            title=ag_data['title'],
            defaults={'age_min': ag_data['age_min'], 'age_max': ag_data['age_max']}
        )
        age_groups.append(ag)

    price_level, _ = PriceLevel.objects.get_or_create(
        title='Základní',
        defaults={'enabled': True}
    )

    doc_types_data = [
        {'title': 'Zdravotní průkaz', 'required': True},
        {'title': 'Souhlas zákonného zástupce', 'required': True},
        {'title': 'Potvrzení od lékaře', 'required': False},
    ]
    doc_types = []
    for dt_data in doc_types_data:
        dt, _ = SignupDocumentType.objects.get_or_create(
            title=dt_data['title'],
            defaults={'required': dt_data['required']}
        )
        doc_types.append(dt)

    print("✅ Created lookup tables")
    return {
        'allergies': allergies,
        'diets': diets,
        'hobbies': hobbies,
        'staff_roles': staff_roles,
        'age_groups': age_groups,
        'price_level': price_level,
        'doc_types': doc_types,
    }


def create_users_and_families():
    """Create test users and families"""
    print("👥 Creating users and families...")

    users = []
    families = []

    parent_data = [
        {'first_name': 'Jana', 'last_name': 'Nováková',
         'email': 'jana.novakova@example.com',
         'phone': '+420 601 234 567'},
        {'first_name': 'Petr', 'last_name': 'Svoboda',
         'email': 'petr.svoboda@example.com',
         'phone': '+420 602 345 678'},
        {'first_name': 'Marie', 'last_name': 'Dvořáková',
         'email': 'marie.dvorakova@example.com',
         'phone': '+420 603 456 789'},
        {'first_name': 'Tomáš', 'last_name': 'Černý',
         'email': 'tomas.cerny@example.com',
         'phone': '+420 604 567 890'},
    ]

    for pd in parent_data:
        user, created = User.objects.get_or_create(
            email=pd['email'],
            defaults={
                'first_name': pd['first_name'],
                'last_name': pd['last_name'],
                'phone': pd['phone'],
                'email_verified': True,
            }
        )
        if created:
            user.set_password(TEST_PASSWORD)
            user.save()
        users.append(user)

        family, _ = Family.objects.get_or_create(
            owner=user,
            defaults={'title': f'Rodina {pd["last_name"]}'}
        )
        families.append(family)

        FamilyMember.objects.get_or_create(
            family=family,
            user=user,
            defaults={'role': FAMILY_ROLE_SPECTATOR}
        )

    print(f"✅ Created {len(users)} users and {len(families)} families")
    return users, families


def create_staff_profiles(lookups):
    """Create staff profiles with photos"""
    print("👨‍🏫 Creating staff profiles...")

    staff_data = [
        {'first_name': 'Martin', 'last_name': 'Kouba',
         'email': 'martin.kouba@fantasion.test',
         'job': 'Hlavní vedoucí', 'role_idx': 0},
        {'first_name': 'Lucie', 'last_name': 'Malá',
         'email': 'lucie.mala@fantasion.test',
         'job': 'Vedoucí', 'role_idx': 1},
        {'first_name': 'David', 'last_name': 'Hora',
         'email': 'david.hora@fantasion.test',
         'job': 'Instruktor', 'role_idx': 2},
        {'first_name': 'Eva', 'last_name': 'Zelená',
         'email': 'eva.zelena@fantasion.test',
         'job': 'Zdravotník', 'role_idx': 3},
    ]

    profiles = []
    staff_users = []

    colors = ['darkblue', 'darkgreen', 'darkred', 'purple']

    for idx, sd in enumerate(staff_data):
        user, created = User.objects.get_or_create(
            email=sd['email'],
            defaults={
                'first_name': sd['first_name'],
                'last_name': sd['last_name'],
                'email_verified': True,
            }
        )
        if created:
            user.set_password(TEST_PASSWORD)
            user.save()
        staff_users.append(user)

        profile, _ = Profile.objects.get_or_create(
            owner=user,
            defaults={
                'job_title': sd['job'],
                'text': f'Zkušený {sd["job"].lower()} s láskou k práci s dětmi.',
                'importance': 100 - (idx * 10),
            }
        )

        if profile and not profile.avatar:
            staff_name = f"{sd['first_name']}\n{sd['last_name']}"
            img = create_test_image(
                400, 400, colors[idx % len(colors)], staff_name
            )
            if img:
                profile.avatar = img
                profile.save()

        profiles.append(profile)

    print(f"✅ Created {len(profiles)} staff profiles")
    return profiles, staff_users


def create_expeditions(locations, lookups):
    """Create expeditions, batches, and troops with photos"""
    print("🏕️  Creating expeditions...")

    centres = []
    centre_data = [
        {'name': 'Tábořiště U Lesa',
         'location_idx': 0, 'color': 'forestgreen'},
        {'name': 'Rekreační středisko Sluníčko',
         'location_idx': 1, 'color': 'gold'},
        {'name': 'Chatová osada Medvěd',
         'location_idx': 2, 'color': 'saddlebrown'},
    ]

    for idx, cd in enumerate(centre_data):
        centre, _ = LeisureCentre.objects.get_or_create(
            title=cd['name'],
            defaults={
                'location': locations[cd['location_idx']],
                'detailed_description': (
                    f'# {cd["name"]}\n\n'
                    f'Nádherné místo pro letní tábor.'
                ),
            }
        )

        if centre:
            from fantasion_expeditions.models import LeisureCentreMedia
            if not LeisureCentreMedia.objects.filter(parent=centre).exists():
                img = create_test_image(1200, 800, cd['color'], cd['name'])
                if img:
                    media = LeisureCentreMedia(parent=centre)
                    media.media = img
                    media.save()

        centres.append(centre)

    theme_data = [
        {'title': 'Pirátské dobrodružství',
         'desc': 'Objevuj moře a hledej poklady!',
         'color': 'navy'},
        {'title': 'Středověk',
         'desc': 'Staň se rytířem nebo princeznou!',
         'color': 'darkslategray'},
        {'title': 'Vesmírná mise',
         'desc': 'Prozkoumej nekonečné vesmírné prostory!',
         'color': 'midnightblue'},
    ]

    themes = []
    for td in theme_data:
        theme, _ = ExpeditionTheme.objects.get_or_create(
            title=td['title'],
            defaults={'description': td['desc']}
        )

        if theme:
            from fantasion_expeditions.models import ExpeditionThemeMedia
            if not ExpeditionThemeMedia.objects.filter(parent=theme).exists():
                img = create_test_image(1200, 600, td['color'], td['title'])
                if img:
                    media = ExpeditionThemeMedia(parent=theme)
                    media.media = img
                    media.save()

        themes.append(theme)

    expeditions = []
    expedition_data = [
        {'title': 'Fantasion 2026', 'theme_idx': 0, 'desc': 'Hlavní letní expedice'},
        {'title': 'Fantasion Junior', 'theme_idx': 1, 'desc': 'Pro nejmenší účastníky'},
    ]

    for ed in expedition_data:
        exp, _ = Expedition.objects.get_or_create(
            title=ed['title'],
            defaults={
                'theme': themes[ed['theme_idx']],
                'description': ed['desc'],
            }
        )
        expeditions.append(exp)

    batches = []
    batch_data = [
        {'expedition_idx': 0, 'centre_idx': 0,
         'start': date(2026, 7, 1), 'end': date(2026, 7, 14)},
        {'expedition_idx': 0, 'centre_idx': 1,
         'start': date(2026, 7, 15), 'end': date(2026, 7, 28)},
        {'expedition_idx': 1, 'centre_idx': 2,
         'start': date(2026, 8, 1), 'end': date(2026, 8, 10)},
    ]

    for bd in batch_data:
        batch, _ = ExpeditionBatch.objects.get_or_create(
            expedition=expeditions[bd['expedition_idx']],
            starts_at=bd['start'],
            defaults={
                'leisure_centre': centres[bd['centre_idx']],
                'ends_at': bd['end'],
            }
        )
        batches.append(batch)

    programs = []
    program_data = [
        {'title': 'Objevitelé', 'desc': 'Program pro mladší děti', 'color': 'lightblue'},
        {'title': 'Dobrodruzi', 'desc': 'Program pro starší děti', 'color': 'orange'},
    ]

    for pd in program_data:
        prog, _ = ExpeditionProgram.objects.get_or_create(
            title=pd['title'],
            defaults={'description': pd['desc']}
        )

        if prog:
            from fantasion_expeditions.models import ExpeditionProgramMedia
            if not ExpeditionProgramMedia.objects.filter(parent=prog).exists():
                img = create_test_image(1200, 600, pd['color'], pd['title'])
                if img:
                    media = ExpeditionProgramMedia(parent=prog)
                    media.media = img
                    media.save()

        programs.append(prog)

    troops = []
    price_level = lookups['price_level']

    for batch in batches:
        for age_group in lookups['age_groups']:
            troop, _ = Troop.objects.get_or_create(
                batch=batch,
                age_group=age_group,
                starts_at=batch.starts_at,
                defaults={
                    'ends_at': batch.ends_at,
                    'program': (
                        programs[0]
                        if age_group.age_min < 10
                        else programs[1]
                    ),
                    'price_includes': '- Ubytování\n- Strava\n- Program\n- Pojištění',
                }
            )
            troops.append(troop)

            base_price = 8000 if age_group.age_min < 10 else 9500
            ProductPrice.objects.get_or_create(
                product=troop,
                price_level=price_level,
                defaults={
                    'price': Money(base_price, CZK),
                    'available_since': timezone.now() - timedelta(days=30),
                }
            )

    print(
        f"✅ Created {len(expeditions)} expeditions, "
        f"{len(batches)} batches, {len(troops)} troops"
    )
    return centres, themes, expeditions, batches, troops, programs


def create_participants(families, lookups):
    """Create child participants"""
    print("👶 Creating participants...")

    participants = []

    children_data = [
        [
            {'first': 'Jakub', 'last': 'Novák',
             'birthdate': date(2015, 3, 15),
             'allergies': [0, 1], 'diets': [], 'hobbies': [0, 2]},
            {'first': 'Tereza', 'last': 'Nováková',
             'birthdate': date(2017, 7, 22),
             'allergies': [], 'diets': [0], 'hobbies': [1, 3]},
        ],
        [
            {'first': 'Marek', 'last': 'Svoboda',
             'birthdate': date(2013, 11, 8),
             'allergies': [], 'diets': [], 'hobbies': [0, 4]},
        ],
        [
            {'first': 'Karolína', 'last': 'Dvořáková',
             'birthdate': date(2016, 5, 30),
             'allergies': [2], 'diets': [2], 'hobbies': [1, 5]},
            {'first': 'Ondřej', 'last': 'Dvořák',
             'birthdate': date(2014, 9, 12),
             'allergies': [], 'diets': [], 'hobbies': [0, 6]},
        ],
        [
            {'first': 'Natálie', 'last': 'Černá',
             'birthdate': date(2018, 1, 5),
             'allergies': [], 'diets': [], 'hobbies': [1, 2]},
        ],
    ]

    allergies = lookups['allergies']
    diets = lookups['diets']
    hobbies = lookups['hobbies']

    for family_idx, family in enumerate(families):
        for child_data in children_data[family_idx]:
            participant, _ = Participant.objects.get_or_create(
                family=family,
                first_name=child_data['first'],
                last_name=child_data['last'],
                defaults={
                    'birthdate': child_data['birthdate'],
                    'no_allergies': len(child_data['allergies']) == 0,
                    'no_diets': len(child_data['diets']) == 0,
                    'no_hobbies': len(child_data['hobbies']) == 0,
                }
            )
            participants.append(participant)

            for allergy_idx in child_data['allergies']:
                ParticipantAllergy.objects.get_or_create(
                    participant=participant,
                    allergy=allergies[allergy_idx]
                )

            for diet_idx in child_data['diets']:
                ParticipantDiet.objects.get_or_create(
                    participant=participant,
                    diet=diets[diet_idx]
                )

            for hobby_idx in child_data['hobbies']:
                ParticipantHobby.objects.get_or_create(
                    participant=participant,
                    hobby=hobbies[hobby_idx]
                )

    print(f"✅ Created {len(participants)} participants")
    return participants


def create_signups_and_orders(participants, troops):
    """Create signups and orders"""
    print("📝 Creating signups and orders...")

    orders = []
    signups = []

    # Skip if signups already exist for these participants
    family1_participants = participants[0:2]
    if Signup.objects.filter(participant__in=family1_participants).exists():
        print("   ⏭️  Signups already exist, skipping creation")
        existing_orders = list(Order.objects.all())
        existing_signups = list(Signup.objects.all())
        return existing_signups, existing_orders

    try:
        # Create order as NEW first (use constructor + save to avoid force_insert)
        order1 = Order(
            owner=family1_participants[0].family.owner,
            status=ORDER_STATUS_NEW,
        )
        order1.save()
        orders.append(order1)

        for idx, participant in enumerate(family1_participants):
            age = (date.today() - participant.birthdate).days // 365
            suitable_troops = [
                t for t in troops
                if t.age_group.age_min <= age <= t.age_group.age_max
            ]
            print(
                f"     Participant {participant.first_name}, "
                f"age {age}, suitable troops: {len(suitable_troops)}"
            )
            if suitable_troops:
                troop = suitable_troops[0]
                print(
                    f"     Creating signup for {participant.first_name} "
                    f"→ {troop.age_group.title}"
                )
                signup = Signup(
                    family=participant.family,
                    participant=participant,
                    troop=troop,
                    order=order1,
                    product_price=troop.get_active_price(),
                    price=troop.get_active_price().price,
                    status=SIGNUP_STATUS_NEW,
                    legal_guardian=True,
                )
                signup.save()
                signups.append(signup)
                print(f"     ✅ Signup {signup.id} created")

        # Now confirm the order
        order1.submitted_at = timezone.now() - timedelta(days=20)
        order1.save()
        order1.confirm()

        # Update signup statuses
        for signup in order1.order_items.all():
            signup.status = SIGNUP_STATUS_CONFIRMED
            signup.submitted_at = order1.submitted_at
            signup.save()

    except Exception as e:
        print(f"   ⚠️  Error creating order 1: {e}")
        import traceback
        traceback.print_exc()

    try:
        family2_participants = participants[2:3]
        # Create order as NEW first (use constructor + save)
        order2 = Order(
            owner=family2_participants[0].family.owner,
            status=ORDER_STATUS_NEW,
        )
        order2.save()
        orders.append(order2)

        for participant in family2_participants:
            age = (date.today() - participant.birthdate).days // 365
            suitable_troops = [
                t for t in troops
                if t.age_group.age_min <= age <= t.age_group.age_max
            ]
            if suitable_troops:
                troop = suitable_troops[0]
                signup = Signup.objects.create(
                    family=participant.family,
                    participant=participant,
                    troop=troop,
                    order=order2,
                    product_price=troop.get_active_price(),
                    price=troop.get_active_price().price,
                    status=SIGNUP_STATUS_NEW,
                    legal_guardian=True,
                )
                signups.append(signup)

        # Confirm and mark as paid
        order2.submitted_at = timezone.now() - timedelta(days=30)
        order2.save()
        order2.confirm()
        order2.status = ORDER_STATUS_PAID
        order2.save()

        # Update signup statuses
        for signup in order2.order_items.all():
            signup.status = SIGNUP_STATUS_ACTIVE
            signup.submitted_at = order2.submitted_at
            signup.save()

    except Exception as e:
        print(f"   ⚠️  Error: {e}")
        import traceback
        traceback.print_exc()

    try:
        family3_participants = participants[3:5]
        # Create order as NEW (use constructor + save)
        order3 = Order(
            owner=family3_participants[0].family.owner,
            status=ORDER_STATUS_NEW,
        )
        order3.save()
        orders.append(order3)

        for participant in family3_participants:
            age = (date.today() - participant.birthdate).days // 365
            suitable_troops = [
                t for t in troops
                if t.age_group.age_min <= age <= t.age_group.age_max
            ]
            if suitable_troops:
                troop = suitable_troops[0]
                signup = Signup.objects.create(
                    family=participant.family,
                    participant=participant,
                    troop=troop,
                    order=order3,
                    product_price=troop.get_active_price(),
                    price=troop.get_active_price().price,
                    status=SIGNUP_STATUS_NEW,
                    legal_guardian=True,
                )
                signups.append(signup)
    except Exception as e:
        print(f"   ⚠️  Error: {e}")
        import traceback
        traceback.print_exc()

    print(f"✅ Created {len(signups)} signups and {len(orders)} orders")
    return signups, orders


def create_content(lookups):
    """Create CMS content and monsters with photos"""
    print("📄 Creating content...")

    flavour_texts = [
        {'text': 'Dobrodružství začíná tam, kde končí comfort zone!',
         'owner': 'Stanislav Kolář', 'importance': 100},
        {'text': 'Nejlepší vzpomínky se tvoří pod širým nebem.',
         'owner': 'Marie Svobodová', 'importance': 90},
    ]

    for ft_data in flavour_texts:
        FlavourText.objects.get_or_create(
            text=ft_data['text'],
            defaults={
                'quote_owner': ft_data['owner'],
                'importance': ft_data['importance'],
            }
        )

    faq_data = [
        {
            'question': 'Jaké jsou náklady na tábor?',
            'short': 'Cena závisí na délce pobytu a věkové kategorii.',
            'detailed': '# Ceník\n\nMladší skupina: 8 000 Kč\nStarší skupina: 9 500 Kč',
            'importance': 100,
        },
        {
            'question': 'Co si vzít s sebou?',
            'short': 'Seznam věcí dostanete emailem po registraci.',
            'detailed': '# Co si vzít\n\n- Spacák\n- Karimatku\n- Oblečení\n- Hygienické potřeby',
            'importance': 90,
        },
    ]

    for faq in faq_data:
        FrequentlyAskedQuestion.objects.get_or_create(
            question=faq['question'],
            defaults={
                'short_answer': faq['short'],
                'detailed_answer': faq['detailed'],
                'importance': faq['importance'],
            }
        )

    # Static articles required by the frontend
    static_articles = [
        {
            'key': 'about-us',
            'title': 'O nás',
            'text': '''# O nás

Fantasion je organizace zaměřená na letní tábory pro děti a mládež.

## Naše mise

Vytváříme nezapomenutelné dobrodružství a zážitky pro děti všech věkových kategorií.

## Co nabízíme

- Letní tábory pro různé věkové skupiny
- Kvalitní program plný her a aktivit
- Zkušené vedoucí a instruktory
- Bezpečné prostředí

## Historie

Naše organizace působí již několik let a každoročně přivítáme stovky spokojených účastníků.''',
        },
        {
            'key': 'privacy-policy',
            'title': 'Zásady ochrany osobních údajů',
            'text': '''# Zásady ochrany osobních údajů

## Správce osobních údajů

Fantasion z. s.

## Jaké údaje zpracováváme

- Jméno a příjmení
- Kontaktní údaje (email, telefon)
- Údaje o dětech (jméno, věk, zdravotní informace)

## Účel zpracování

Osobní údaje zpracováváme za účelem:
- Realizace letních táborů
- Komunikace s rodiči a účastníky
- Zajištění bezpečnosti dětí

## Vaše práva

Máte právo na přístup ke svým osobním údajům, jejich opravu nebo výmaz.

## Kontakt

V případě dotazů nás kontaktujte na info@fantasion.cz''',
        },
        {
            'key': 'terms-and-conditions',
            'title': 'Obchodní podmínky',
            'text': '''# Obchodní podmínky

## 1. Základní ustanovení

Tyto obchodní podmínky upravují vztah mezi organizátorem
(Fantasion z. s.) a účastníky letních táborů.

## 2. Cena a platba

- Cena je uvedena na webových stránkách
- Platba se provádí bankovním převodem
- Je možné využít zálohu

## 3. Storno podmínky

- Storno do 30 dnů: 100% vrácení
- Storno do 14 dnů: 50% vrácení
- Storno méně než 14 dnů: bez vrácení

## 4. Odpovědnost

Organizátor neodpovídá za ztrátu nebo poškození osobních věcí účastníků.

## 5. Závěrečná ustanovení

Tyto podmínky nabývají účinnosti dnem zveřejnění na webových stránkách.''',
        },
        {
            'key': 'cookies-policy',
            'title': 'Zásady používání cookies',
            'text': '''# Zásady používání cookies

## Co jsou cookies

Cookies jsou malé textové soubory, které ukládá Váš prohlížeč při návštěvě webových stránek.

## Jaké cookies používáme

### Nezbytné cookies
- Cookies pro správu přihlášení
- Cookies pro nákupní košík

### Analytické cookies
- Google Analytics pro sledování návštěvnosti

## Jak cookies spravovat

Cookies můžete odmítnout nebo smazat ve svém prohlížeči.

## Více informací

Pro více informací nás kontaktujte na info@fantasion.cz''',
        },
        {
            'key': 'codex',
            'title': 'Kodex účastníka',
            'text': '''# Kodex účastníka tábora

## Pravidla chování

1. **Respekt** - Chovej se ke všem slušně a s respektem
2. **Bezpečnost** - Dodržuj bezpečnostní pravidla
3. **Čistota** - Udržuj své okolí čisté
4. **Spolupráce** - Spolupracuj s ostatními

## Co je zakázáno

- Opouštění areálu bez souhlasu vedoucích
- Užívání alkoholu a jiných návykových látek
- Šikana a hrubé chování
- Poškozování majetku

## Následky porušení

Při porušení kodexu může být účastník vyloučen z tábora bez náhrady.

## Závěr

Dodržováním těchto pravidel zajistíš příjemný pobyt sobě i ostatním.''',
        },
        {
            'key': 'bestiary-info',
            'title': 'O bestiáři',
            'text': '''# Bestiář

Vítejte v našem bestiáři! Zde najdete všechny kouzelné
bytosti, které můžete potkat během našich táborů.

## Co je bestiář?

Bestiář je sbírka informací o fantastických tvorech, kteří obývají svět Fantasionu.

## Jak využít bestiář?

Během tábora budete mít možnost:
- Potkat některé z těchto bytostí
- Plnit úkoly spojené s nimi
- Dozvědět se jejich příběhy

## Legendy a příběhy

Každá bytost má svůj vlastní příběh a čeká na to, až ji objevíte!''',
        },
    ]

    for article_data in static_articles:
        StaticArticle.objects.get_or_create(
            key=article_data['key'],
            defaults={
                'title': article_data['title'],
                'text': article_data['text'],
            }
        )

    monster_data = [
        {'species': 'Drak', 'name': 'Ohnivý drak', 'desc': 'Strážce pokladů', 'color': 'darkred'},
        {'species': 'Skřítek', 'name': 'Lesní skřítek', 'desc': 'Ochránce lesa', 'color': 'green'},
        {'species': 'Fénix', 'name': 'Zlatý fénix', 'desc': 'Pták znovuzrození', 'color': 'orange'},
    ]

    for idx, md in enumerate(monster_data):
        monster, _ = Monster.objects.get_or_create(
            species=md['species'],
            defaults={
                'title': md['name'],
                'description': md['desc'],
                'text': f'# {md["name"]}\n\n{md["desc"]}',
                'importance': 100 - (idx * 10),
            }
        )

        if monster and not monster.avatar:
            img = create_test_image(600, 600, md['color'], md['species'])
            if img:
                monster.avatar = img
                monster.save()

    print("✅ Created content")


def create_transport(locations, batches):
    """Create transport vehicles and routes"""
    print("🚌 Creating transport...")

    vehicle_data = [
        {'brand': 'Mercedes', 'model': 'Sprinter', 'year': 2020, 'color': 'Bílá'},
        {'brand': 'Volkswagen', 'model': 'Crafter', 'year': 2019, 'color': 'Modrá'},
    ]

    vehicles = []
    for vd in vehicle_data:
        vehicle, _ = TransportVehicle.objects.get_or_create(
            brand=vd['brand'],
            model=vd['model'],
            year=vd['year'],
            defaults={
                'title': f'{vd["brand"]} {vd["model"]}',
                'color': vd['color'],
            }
        )
        vehicles.append(vehicle)

    prague = locations[-1]

    for batch in batches[:2]:
        venue = batch.leisure_centre.location

        transport_there = Transport.objects.create(
            departs_from=prague,
            arrives_to=venue,
            vehicle=vehicles[0],
            departs_at=timezone.make_aware(
                datetime.combine(
                    batch.starts_at,
                    datetime.min.time().replace(hour=9)
                )
            ),
            arrives_at=timezone.make_aware(
                datetime.combine(
                    batch.starts_at,
                    datetime.min.time().replace(hour=11)
                )
            ),
            status=TRANSPORT_PLANNED,
            description='Odjezd na tábor',
        )

        transport_back = Transport.objects.create(
            departs_from=venue,
            arrives_to=prague,
            vehicle=vehicles[0],
            departs_at=timezone.make_aware(
                datetime.combine(
                    batch.ends_at,
                    datetime.min.time().replace(hour=14)
                )
            ),
            arrives_at=timezone.make_aware(
                datetime.combine(
                    batch.ends_at,
                    datetime.min.time().replace(hour=16)
                )
            ),
            status=TRANSPORT_PLANNED,
            description='Návrat z tábora',
        )

        for troop in batch.troops.all():
            TroopTransport.objects.create(
                troop=troop,
                transport=transport_there,
                direction=TRANSPORT_DIRECTION_THERE,
            )
            TroopTransport.objects.create(
                troop=troop,
                transport=transport_back,
                direction=TRANSPORT_DIRECTION_BACK,
            )

    print("✅ Created transport")


def create_batch_staff(batches, profiles, staff_roles):
    """Assign staff to batches"""
    print("👨‍🏫 Assigning staff to batches...")

    for batch in batches[:2]:
        for idx, profile in enumerate(profiles[:3]):
            role = staff_roles[min(idx, len(staff_roles) - 1)]
            BatchStaff.objects.get_or_create(
                batch=batch,
                profile=profile,
                role=role,
            )

    print("✅ Assigned staff to batches")


def create_promotion_codes():
    """Create promotion codes"""
    print("🎟️  Creating promotion codes...")

    codes = [
        {'code': 'EARLY2026', 'discount': 10, 'max_discount': 1000},
        {'code': 'SIBLING', 'discount': 15, 'max_discount': 1500},
        {'code': 'WELCOME', 'discount': 5, 'max_discount': 500},
    ]

    for code_data in codes:
        PromotionCode.objects.get_or_create(
            code=code_data['code'],
            defaults={
                'discount': code_data['discount'],
                'max_discount': (
                    Money(code_data['max_discount'], CZK)
                    if code_data['max_discount']
                    else None
                ),
                'enabled': True,
                'valid_from': timezone.now() - timedelta(days=60),
                'valid_until': timezone.now() + timedelta(days=120),
            }
        )

    print("✅ Created promotion codes")


def main():
    """Main function to create all test data"""
    print("🚀 Starting test data creation for Fantasion...")
    print("=" * 60)

    # Note: Using get_or_create throughout, so safe to run multiple times
    # Uncomment clear_existing_data() if you want to start fresh

    locations = create_locations()
    lookups = create_lookups()
    users, families = create_users_and_families()
    profiles, staff_users = create_staff_profiles(lookups)
    centres, themes, expeditions, batches, troops, programs = create_expeditions(locations, lookups)
    participants = create_participants(families, lookups)
    signups, orders = create_signups_and_orders(participants, troops)
    create_content(lookups)
    create_transport(locations, batches)
    create_batch_staff(batches, profiles, lookups['staff_roles'])
    create_promotion_codes()

    print("=" * 60)
    print("✅ Test data creation complete!")
    print()
    print("📊 Summary:")
    print(f"   {'-'} Users: {len(users) + len(staff_users)}")
    print(f"   {'-'} Families: {len(families)}")
    print(f"   {'-'} Participants: {len(participants)}")
    print(f"   {'-'} Staff Profiles: {len(profiles)}")
    print(f"   {'-'} Expeditions: {len(expeditions)}")
    print(f"   {'-'} Batches: {len(batches)}")
    print(f"   {'-'} Troops: {len(troops)}")
    print(f"   {'-'} Signups: {len(signups)}")
    print(f"   {'-'} Orders: {len(orders)}")
    print()
    print("🔑 Test credentials (all users):")
    print(f"   Password: {TEST_PASSWORD}")
    print()
    print("📧 Test user emails:")
    print("   - jana.novakova@example.com")
    print("   - petr.svoboda@example.com")
    print("   - marie.dvorakova@example.com")
    print("   - tomas.cerny@example.com")
    print()
    print("💡 To install Pillow for photo generation:")
    print("   cd packages/fantasion-backend && uv add pillow")


class Command(BaseCommand):
    help = 'Create comprehensive test data for Fantasion development'

    def handle(self, *args, **options):
        main()
