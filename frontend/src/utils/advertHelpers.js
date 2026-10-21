// Запрещенные слова для заголовка
const BAD_WORDS = ['срочно', 'торг', 'продам', 'куплю', 'даром', 'дешево', 'продается', 'обмен', 'услуги'];

// Умная генерация названия
export const generateSmartTitle = (category, fields) => {
  if (!fields || Object.keys(fields).length === 0) return '';

  const parts = [];
  
  // Транспорт (Авто)
  if (category === 2 || category === '2') {
    if (fields.brand) parts.push(fields.brand);
    if (fields.model) parts.push(fields.model);
    if (fields.year) parts.push(`, ${fields.year}`);
  }
  // Электроника
  else if (category === 3 || category === '3') {
    if (fields.brand) parts.push(fields.brand);
    if (fields.model) parts.push(fields.model);
    if (fields.completeness) parts.push(`(${fields.completeness})`);
  }
  // Недвижимость
  else if (category === 1 || category === '1') {
    if (fields.rooms) parts.push(`${fields.rooms}-комн.`);
    if (fields.property_type) parts.push(fields.property_type.toLowerCase());
    if (fields.area) parts.push(`, ${fields.area} м²`);
  }
  // Животные
  else if (category === 7 || category === '7') {
    if (fields.species) parts.push(fields.species);
    if (fields.breed) parts.push(fields.breed);
    if (fields.age) parts.push(`, ${fields.age}`);
  }
  // Одежда
  else if (category === 4 || category === '4') {
    if (fields.brand) parts.push(fields.brand);
    if (fields.product_type) parts.push(fields.product_type);
    if (fields.size) parts.push(`р. ${fields.size}`);
  }
  // Для остальных категорий — берем первые 2-3 заполненных поля
  else {
    const values = Object.values(fields).filter(v => v && v !== '__other__' && v !== '_manual');
    parts.push(...values.slice(0, 3));
  }

  let title = parts.join(' ').trim();
  // Очищаем от двойных запятых и лишних пробелов
  title = title.replace(/\s+/g, ' ').replace(/,\s*,/g, ',').replace(/^,|,$/g, '');
  
  return title;
};

// Очистка названия от мусорных слов
export const cleanTitle = (title) => {
  if (!title) return '';
  let cleaned = title;
  BAD_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    cleaned = cleaned.replace(regex, '');
  });
  return cleaned.replace(/\s+/g, ' ').trim();
};