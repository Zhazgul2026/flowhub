// Словарь дополнительных полей по категориям.
// Ключ — id категории из API (/api/adverts/categories/).
// type: 'text' | 'number' | 'select'

export const CATEGORY_FIELDS = {
  1: [ // Недвижимость
    { name: 'deal_type', label: 'Тип сделки', type: 'select', options: ['Продажа', 'Аренда'] },
    { name: 'property_type', label: 'Тип объекта', type: 'select', options: ['Квартира', 'Дом', 'Участок', 'Гараж', 'Комната'] },
    { name: 'rooms', label: 'Комнат', type: 'number', placeholder: '2' },
    { name: 'area', label: 'Площадь, м²', type: 'number', placeholder: '60' },
    { name: 'floor', label: 'Этаж', type: 'number', placeholder: '5' },
    { name: 'floors_total', label: 'Этажей в доме', type: 'number', placeholder: '9' },
  ],
  2: [ // Транспорт
    { name: 'brand', label: 'Марка', type: 'text', placeholder: 'Toyota' },
    { name: 'model', label: 'Модель', type: 'text', placeholder: 'Camry' },
    { name: 'year', label: 'Год выпуска', type: 'number', placeholder: '2020' },
    { name: 'mileage', label: 'Пробег, км', type: 'number', placeholder: '45000' },
    { name: 'transmission', label: 'КПП', type: 'select', options: ['Автомат', 'Механика', 'Робот', 'Вариатор'] },
    { name: 'fuel', label: 'Топливо', type: 'select', options: ['Бензин', 'Дизель', 'Гибрид', 'Электро'] },
    { name: 'condition', label: 'Состояние', type: 'select', options: ['Новое', 'Отличное', 'Хорошее', 'Требует ремонта'] },
  ],
  3: [ // Электроника
    { name: 'brand', label: 'Бренд', type: 'text', placeholder: 'Apple' },
    { name: 'model', label: 'Модель', type: 'text', placeholder: 'iPhone 15 Pro' },
    { name: 'condition', label: 'Состояние', type: 'select', options: ['Новое', 'Б/у'] },
    { name: 'warranty', label: 'Гарантия', type: 'select', options: ['Есть', 'Нет'] },
  ],
  4: [ // Одежда и обувь
    { name: 'brand', label: 'Бренд', type: 'text', placeholder: 'Nike' },
    { name: 'size', label: 'Размер', type: 'text', placeholder: 'M / 42' },
    { name: 'color', label: 'Цвет', type: 'text', placeholder: 'Чёрный' },
    { name: 'condition', label: 'Состояние', type: 'select', options: ['Новое с биркой', 'Новое без бирки', 'Б/у'] },
  ],
  5: [ // Дом и сад
    { name: 'product_type', label: 'Тип товара', type: 'text', placeholder: 'Мебель / Инструмент / Растения' },
    { name: 'brand', label: 'Бренд', type: 'text' },
    { name: 'condition', label: 'Состояние', type: 'select', options: ['Новое', 'Б/у'] },
  ],
  6: [ // Работа и услуги
    { name: 'deal_type', label: 'Тип', type: 'select', options: ['Вакансия', 'Резюме', 'Услуга'] },
    { name: 'experience', label: 'Опыт', type: 'select', options: ['Без опыта', 'От 1 года', 'От 3 лет', 'Более 5 лет'] },
    { name: 'schedule', label: 'График', type: 'select', options: ['Полный день', 'Сменный', 'Гибкий', 'Удалённо', 'Подработка'] },
    { name: 'salary_from', label: 'Зарплата от, ₽', type: 'number' },
  ],
  7: [ // Животные
    { name: 'species', label: 'Вид', type: 'select', options: ['Собака', 'Кошка', 'Птица', 'Грызун', 'Рыба', 'Другое'] },
    { name: 'breed', label: 'Порода', type: 'text', placeholder: 'Лабрадор' },
    { name: 'age', label: 'Возраст', type: 'text', placeholder: '2 года' },
    { name: 'gender', label: 'Пол', type: 'select', options: ['Мальчик', 'Девочка'] },
    { name: 'vaccinated', label: 'Прививки', type: 'select', options: ['Есть', 'Нет'] },
  ],
  8: [ // Хобби и отдых
    { name: 'product_type', label: 'Тип', type: 'text', placeholder: 'Спорт / Музыка / Книги' },
    { name: 'brand', label: 'Бренд', type: 'text' },
    { name: 'condition', label: 'Состояние', type: 'select', options: ['Новое', 'Б/у'] },
  ],
  9: [ // Коллекции и антиквариат
    { name: 'product_type', label: 'Тип', type: 'text', placeholder: 'Монеты / Марки / Картины' },
    { name: 'era', label: 'Год / Эпоха', type: 'text', placeholder: 'XIX век' },
    { name: 'condition', label: 'Состояние', type: 'select', options: ['Отличное', 'Хорошее', 'Удовлетворительное'] },
    { name: 'authenticity', label: 'Подлинность', type: 'select', options: ['Оригинал', 'Копия', 'Не знаю'] },
  ],
};

// Удобный хелпер: получить поля для категории
export const getFieldsForCategory = (categoryId) => {
  return CATEGORY_FIELDS[Number(categoryId)] || [];
};