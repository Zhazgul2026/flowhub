BAD_WORDS = [
    'мат', 'хуй', 'пизда', 'блядь', 'сука', 'залупа', 'мудак',
    'редиска', 'козел', 'лох', 'пидор', 'гандон', 'шлюха', 'бля',
    'нахуй', 'похуй', 'ебать', 'ебанутый', 'пидрила', 'сучка',
    'засранец', 'говно', 'дерьмо', 'хрен', 'нихуя', 'пиздец',
    'охуеть', 'заебать', 'долбаеб', 'уебище', 'манда', 'петух'
]

FORBIDDEN_DOMAINS = [
    'avito.ru', 'youla.ru', 'ozon.ru', 'wildberries.ru',
    'lamoda.ru', 'sbermarket.ru', 'yandex.market'
]

def check_bad_words(text):
    if not text:
        return None
    text_lower = text.lower()
    for word in BAD_WORDS:
        if word in text_lower:
            return f"Обнаружено запрещённое слово: {word}"
    return None

def check_forbidden_links(text):
    if not text:
        return None
    for domain in FORBIDDEN_DOMAINS:
        if domain in text.lower():
            return f"Обнаружена ссылка на конкурента: {domain}"
    return None

def moderate_text(text):
    errors = []
    bad_word_result = check_bad_words(text)
    if bad_word_result:
        errors.append(bad_word_result)
    link_result = check_forbidden_links(text)
    if link_result:
        errors.append(link_result)
    return errors if errors else None