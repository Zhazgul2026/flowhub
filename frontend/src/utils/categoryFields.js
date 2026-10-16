// Словарь дополнительных полей по категориям.
// Типы полей: 'text' | 'number' | 'select' | 'dependent'

export const CATEGORY_FIELDS = {
  // 1. Недвижимость
  1: [
    { name: 'deal_type', label: 'Тип сделки', type: 'select', options: ['Продажа', 'Аренда', 'Субаренда'] },
    { name: 'property_type', label: 'Тип объекта', type: 'select', options: ['Квартира', 'Дом', 'Часть дома', 'Участок', 'Гараж', 'Коммерческая'] },
    { name: 'seller_type', label: 'Кто выкладывает', type: 'select', options: ['Собственник', 'Риэлтор', 'Агентство'] },
    { name: 'rooms', label: 'Комнат', type: 'select', options: ['Студия', '1', '2', '3', '4', '5+'] },
    { name: 'area', label: 'Площадь, м²', type: 'number', placeholder: '60' },
    { name: 'floor', label: 'Этаж', type: 'number', placeholder: '5' },
    { name: 'floors_total', label: 'Этажей в доме', type: 'number', placeholder: '9' },
    { name: 'bathroom', label: 'Санузел', type: 'select', options: ['Раздельный', 'Совмещённый', 'Несколько'] },
    { name: 'repair', label: 'Ремонт', type: 'select', options: ['Косметический', 'Евро', 'Дизайнерский', 'Без ремонта'] },
  ],

  // 2. Транспорт
  2: [
    { name: 'vehicle_type', label: 'Тип транспорта', type: 'select', options: [
      { value: 'car', label: 'Автомобиль' },
      { value: 'moto', label: 'Мотоцикл' },
      { value: 'truck', label: 'Грузовик' },
      { value: 'special', label: 'Спецтехника' },
      { value: 'water', label: 'Водный транспорт' },
    ]},
    { name: 'brand', label: 'Марка', type: 'dependent', catalogKey: 'VEHICLE_BRANDS', dependsOn: 'vehicle_type' },
    { name: 'model', label: 'Модель', type: 'dependent', catalogKey: 'VEHICLE_MODELS', dependsOn: 'brand' },
    { name: 'year', label: 'Год выпуска', type: 'number', placeholder: '2020' },
    { name: 'mileage', label: 'Пробег, км', type: 'number', placeholder: '45000' },
    { name: 'transmission', label: 'КПП', type: 'select', options: ['Автомат', 'Механика', 'Робот', 'Вариатор'] },
    { name: 'fuel', label: 'Топливо', type: 'select', options: ['Бензин', 'Дизель', 'Гибрид', 'Электро', 'Газ'] },
    { name: 'drive', label: 'Привод', type: 'select', options: ['Передний', 'Задний', 'Полный'] },
    { name: 'condition', label: 'Состояние', type: 'select', options: ['Новое', 'Отличное', 'Хорошее', 'Требует ремонта'] },
    { name: 'owners', label: 'Владельцев по ПТС', type: 'select', options: ['1', '2', '3', '4+'] },
  ],

  // 3. Электроника
  3: [
    { name: 'product_type', label: 'Тип', type: 'select', options: [
      { value: 'smartphone', label: 'Смартфон' },
      { value: 'laptop', label: 'Ноутбук' },
      { value: 'tablet', label: 'Планшет' },
      { value: 'tv', label: 'Телевизор' },
      { value: 'headphones', label: 'Наушники' },
      { value: 'console', label: 'Игровая приставка' },
      { value: 'appliances', label: 'Бытовая техника' },
      { value: 'other', label: 'Другое' },
    ]},
    { name: 'brand', label: 'Бренд', type: 'dependent', catalogKey: 'ELECTRONICS_BRANDS', dependsOn: 'product_type' },
    { name: 'model', label: 'Модель', type: 'text', placeholder: 'iPhone 15 Pro' },
    { name: 'condition', label: 'Состояние', type: 'select', options: ['Новое', 'Отличное', 'Хорошее', 'Б/у'] },
    { name: 'warranty', label: 'Гарантия', type: 'select', options: ['Есть', 'Нет'] },
    { name: 'completeness', label: 'Комплект', type: 'select', options: ['Полный', 'Без коробки', 'Только устройство'] },
  ],

  // 4. Одежда и обувь
  4: [
    { name: 'product_type', label: 'Тип', type: 'select', options: ['Верхняя одежда', 'Платья', 'Футболки', 'Джинсы', 'Обувь', 'Аксессуары', 'Другое'] },
    { name: 'brand', label: 'Бренд', type: 'dependent', catalogKey: 'CLOTHING_BRANDS' },
    { name: 'size', label: 'Размер', type: 'text', placeholder: 'M / 42' },
    { name: 'color', label: 'Цвет', type: 'text', placeholder: 'Чёрный' },
    { name: 'gender', label: 'Для кого', type: 'select', options: ['Мужское', 'Женское', 'Унисекс', 'Детское'] },
    { name: 'condition', label: 'Состояние', type: 'select', options: ['Новое с биркой', 'Новое без бирки', 'Б/у'] },
  ],

  // 5. Дом и сад
  5: [
    { name: 'product_type', label: 'Тип товара', type: 'select', options: ['Мебель', 'Инструмент', 'Растения', 'Декор', 'Посуда', 'Текстиль', 'Другое'] },
    { name: 'brand', label: 'Бренд', type: 'dependent', catalogKey: 'HOME_BRANDS' },
    { name: 'material', label: 'Материал', type: 'text', placeholder: 'Дерево / Металл' },
    { name: 'condition', label: 'Состояние', type: 'select', options: ['Новое', 'Отличное', 'Хорошее', 'Б/у'] },
  ],

  // 6. Работа и услуги
  6: [
    { name: 'deal_type', label: 'Тип', type: 'select', options: ['Вакансия', 'Резюме', 'Услуга'] },
    { name: 'category_work', label: 'Сфера', type: 'select', options: ['IT', 'Строительство', 'Торговля', 'Образование', 'Медицина', 'Транспорт', 'Бытовые услуги', 'Другое'] },
    { name: 'experience', label: 'Опыт', type: 'select', options: ['Без опыта', 'От 1 года', 'От 3 лет', 'Более 5 лет'] },
    { name: 'schedule', label: 'График', type: 'select', options: ['Полный день', 'Сменный', 'Гибкий', 'Удалённо', 'Подработка'] },
    { name: 'salary_from', label: 'Зарплата от, ₽', type: 'number' },
  ],

  // 7. Животные
  7: [
    { name: 'species', label: 'Вид', type: 'select', options: ['Собака', 'Кошка', 'Птица', 'Грызун', 'Рыба', 'Рептилия', 'Другое'] },
    { name: 'breed', label: 'Порода', type: 'text', placeholder: 'Лабрадор' },
    { name: 'age', label: 'Возраст', type: 'text', placeholder: '2 года' },
    { name: 'gender', label: 'Пол', type: 'select', options: ['Мальчик', 'Девочка'] },
    { name: 'vaccinated', label: 'Прививки', type: 'select', options: ['Есть', 'Нет'] },
    { name: 'documents', label: 'Документы', type: 'select', options: ['Есть', 'Нет'] },
  ],

  // 8. Хобби и отдых
  8: [
    { name: 'product_type', label: 'Тип', type: 'select', options: ['Спорт', 'Музыка', 'Книги', 'Туризм', 'Коллекционное', 'Настольные игры', 'Другое'] },
    { name: 'brand', label: 'Бренд', type: 'dependent', catalogKey: 'HOBBY_BRANDS' },
    { name: 'condition', label: 'Состояние', type: 'select', options: ['Новое', 'Отличное', 'Хорошее', 'Б/у'] },
  ],

  // 9. Коллекции и антиквариат
  9: [
    { name: 'product_type', label: 'Тип', type: 'select', options: ['Монеты', 'Марки', 'Картины', 'Книги', 'Иконы', 'Оружие', 'Фарфор', 'Другое'] },
    { name: 'era', label: 'Год / Эпоха', type: 'text', placeholder: 'XIX век' },
    { name: 'condition', label: 'Состояние', type: 'select', options: ['Отличное', 'Хорошее', 'Удовлетворительное'] },
    { name: 'authenticity', label: 'Подлинность', type: 'select', options: ['Оригинал', 'Копия', 'Не знаю'] },
    { name: 'documents', label: 'Документы / экспертиза', type: 'select', options: ['Есть', 'Нет'] },
  ],
};

// Хелпер: получить поля для категории
export const getFieldsForCategory = (categoryId) => {
  return CATEGORY_FIELDS[Number(categoryId)] || [];
};

// Хелпер: нормализовать options (могут быть строками или объектами {value, label})
export const normalizeOptions = (options = []) => {
  return options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );
};