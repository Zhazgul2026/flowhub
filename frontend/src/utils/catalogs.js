// Справочники брендов и моделей для динамических селектов.
// Пока локальные, потом можно мигрировать на API без изменения фронта.

// ============ ТРАНСПОРТ ============

export const VEHICLE_BRANDS = {
  car: [
    'Lada', 'Toyota', 'Kia', 'Hyundai', 'BMW', 'Mercedes-Benz', 'Audi',
    'Volkswagen', 'Nissan', 'Renault', 'Ford', 'Chevrolet', 'Skoda', 'Mazda',
    'Mitsubishi', 'Subaru', 'Volvo', 'Land Rover', 'Lexus', 'Infiniti',
    'Honda', 'Suzuki', 'Chery', 'Haval', 'Geely', 'Exeed', 'Changan',
    'Omoda', 'Tank', 'Москвич', 'ГАЗ', 'УАЗ', 'Peugeot', 'Citroen', 'Opel',
    'Jeep', 'Porsche', 'Jaguar', 'Mini', 'Datsun', 'Dodge', 'Cadillac',
    'Genesis', 'Tesla', 'Ravon', 'Datsun', 'FAW', 'Brilliance', 'Vortex',
  ],
  moto: [
    'Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'BMW', 'Ducati', 'KTM',
    'Harley-Davidson', 'Triumph', 'Aprilia', 'Indian', 'Husqvarna',
    'Ural', 'ИЖ', 'Минск',
  ],
  truck: [
    'КАМАЗ', 'ГАЗ', 'МАЗ', 'Volvo', 'Scania', 'MAN', 'DAF', 'Mercedes-Benz',
    'Isuzu', 'Hyundai', 'Hino', 'Iveco', 'Renault Trucks', 'Foton', 'FAW',
    'Shacman', 'Howo', 'Урал', 'ЗИЛ',
  ],
  special: [
    'JCB', 'CAT', 'Komatsu', 'Hitachi', 'Bobcat', 'XCMG', 'LiuGong',
    'Doosan', 'Volvo CE', 'Liebherr', 'Terex', 'Zoomlion', 'SANY',
    'Кировец', 'ЧТЗ', 'Амкодор',
  ],
  water: [
    'Yamaha', 'Honda', 'Mercury', 'Suzuki', 'Tohatsu', 'Kawasaki',
    'BRP', 'Polaris',
  ],
};

export const VEHICLE_MODELS = {
  // === АВТО ===
  'Lada': ['Granta', 'Vesta', 'Niva', 'Largus', 'XRAY', 'Kalina', 'Priora', '2114', '2107'],
  'Toyota': ['Camry', 'Corolla', 'RAV4', 'Land Cruiser', 'Land Cruiser Prado', 'Highlander', 'Prius', 'Yaris', 'C-HR', 'Fortuner', 'Alphard', 'Hilux'],
  'Kia': ['Rio', 'Sportage', 'Sorento', 'Optima', 'K5', 'Ceed', 'Seltos', 'Soul', 'Cerato', 'Karnival'],
  'Hyundai': ['Solaris', 'Creta', 'Tucson', 'Santa Fe', 'Elantra', 'Sonata', 'i30', 'i20', 'Palisade', 'Staria'],
  'BMW': ['3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X6', 'X7', 'M3', 'M5', 'i3', 'iX'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'A-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'G-Class', 'V-Class', 'Sprinter'],
  'Audi': ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'e-tron'],
  'Volkswagen': ['Polo', 'Golf', 'Passat', 'Tiguan', 'Touareg', 'Jetta', 'Arteon', 'Teramont', 'Multivan', 'Amarok'],
  'Nissan': ['Qashqai', 'X-Trail', 'Juke', 'Murano', 'Almera', 'Teana', 'Patrol', 'Note', 'Terrano', 'Leaf'],
  'Renault': ['Logan', 'Duster', 'Sandero', 'Kaptur', 'Arkana', 'Megane', 'Scenic', 'Koleos', 'Fluence'],
  'Ford': ['Focus', 'Mondeo', 'Fiesta', 'Kuga', 'Explorer', 'Ranger', 'Transit', 'Mustang', 'Edge'],
  'Chevrolet': ['Cruze', 'Aveo', 'Lacetti', 'Captiva', 'Niva', 'Camaro', 'Tahoe', 'Malibu', 'Spark'],
  'Skoda': ['Octavia', 'Superb', 'Kodiaq', 'Karoq', 'Rapid', 'Fabia', 'Yeti', 'Scala'],
  'Mazda': ['3', '6', 'CX-5', 'CX-7', 'CX-9', 'CX-30', 'MX-5', 'CX-60'],
  'Mitsubishi': ['Lancer', 'Outlander', 'ASX', 'Pajero', 'Pajero Sport', 'L200', 'Eclipse Cross', 'Galant'],
  'Subaru': ['Forester', 'Outback', 'Impreza', 'Legacy', 'XV', 'WRX', 'Tribeca'],
  'Volvo': ['XC40', 'XC60', 'XC90', 'S60', 'S90', 'V40', 'V60', 'V90'],
  'Land Rover': ['Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Sport', 'Range Rover Evoque', 'Defender', 'Freelander'],
  'Lexus': ['RX', 'NX', 'GX', 'LX', 'ES', 'IS', 'LS', 'UX', 'LC'],
  'Infiniti': ['QX50', 'QX60', 'QX70', 'QX80', 'Q50', 'Q60', 'Q30', 'FX'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit', 'HR-V', 'Jazz', 'Odyssey'],
  'Suzuki': ['Swift', 'Vitara', 'SX4', 'Jimny', 'Ignis', 'Baleno', 'Grand Vitara'],
  'Chery': ['Tiggo 4', 'Tiggo 7 Pro', 'Tiggo 8', 'Tiggo 8 Pro', 'Arrizo 5', 'Arrizo 8', 'Tiggo 2'],
  'Haval': ['Jolion', 'H6', 'Dargo', 'F7', 'F7x', 'H9', 'H5'],
  'Geely': ['Coolray', 'Atlas', 'Atlas Pro', 'Tugella', 'Monjaro', 'Emgrand', 'Okavango'],
  'Exeed': ['TXL', 'VX', 'LX', 'RX', 'TX'],
  'Changan': ['CS35 Plus', 'CS55 Plus', 'CS75 Plus', 'UNI-K', 'UNI-T', 'Alsvin', 'Eado'],
  'Omoda': ['C5', 'S5'],
  'Tank': ['300', '500', '700'],
  'Москвич': ['3', '3е', '6', '8'],
  'ГАЗ': ['Газель', 'Газель Некст', 'Соболь', 'Волга', 'Сайбер'],
  'УАЗ': ['Patriot', 'Hunter', 'Profi', 'Буханка', 'Pickup'],
  'Peugeot': ['208', '308', '408', '2008', '3008', '5008', 'Partner', 'Boxer'],
  'Citroen': ['C3', 'C4', 'C5', 'Berlingo', 'Jumpy', 'Jumper'],
  'Opel': ['Astra', 'Corsa', 'Insignia', 'Zafira', 'Mokka', 'Vivaro'],
  'Jeep': ['Grand Cherokee', 'Cherokee', 'Compass', 'Renegade', 'Wrangler'],
  'Porsche': ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', 'Boxster', 'Cayman'],
  'Jaguar': ['XE', 'XF', 'XJ', 'F-Pace', 'E-Pace', 'F-Type', 'I-Pace'],
  'Mini': ['Cooper', 'Countryman', 'Clubman', 'Cabrio'],
  'Datsun': ['on-DO', 'mi-DO'],
  'Dodge': ['Charger', 'Challenger', 'Durango', 'Journey', 'Ram'],
  'Cadillac': ['Escalade', 'CTS', 'XT5', 'XT6', 'CT6'],
  'Genesis': ['G70', 'G80', 'G90', 'GV70', 'GV80'],
  'Tesla': ['Model S', 'Model 3', 'Model X', 'Model Y'],
  'Ravon': ['R2', 'R4', 'Nexia', 'Gentra'],
  'FAW': ['V5', 'Besturn X40', 'Besturn X80', 'Oley'],
  'Brilliance': ['V3', 'V5', 'H230', 'H530', 'M2', 'M3'],
  'Vortex': ['Tingo', 'Estina', 'Corda'],

  // === МОТО ===
  'Yamaha': ['YZF-R1', 'YZF-R6', 'MT-07', 'MT-09', 'MT-03', 'FZ6', 'FZ1', 'XSR700', 'TMAX', 'XT660'],
  'Kawasaki': ['Ninja 400', 'Ninja 650', 'Ninja ZX-6R', 'Ninja ZX-10R', 'Z650', 'Z900', 'Versys 650', 'Versys 1000'],
  'Ducati': ['Monster', 'Panigale V4', 'Multistrada', 'Diavel', 'Scrambler', 'Hypermotard'],
  'KTM': ['Duke 390', 'Duke 790', 'RC 390', 'Adventure 390', 'Adventure 790', 'EXC 300'],
  'Harley-Davidson': ['Sportster', 'Softail', 'Touring', 'Street', 'V-Rod', 'Fat Boy'],
  'Triumph': ['Bonneville', 'Street Triple', 'Speed Triple', 'Tiger', 'Rocket 3'],
  'Aprilia': ['RSV4', 'Tuono', 'RS 660', 'Shiver', 'Dorsoduro'],
  'Indian': ['Scout', 'Chief', 'Chieftain', 'Roadmaster'],
  'Husqvarna': ['Svartpilen 401', 'Vitpilen 401', 'TE 300', 'FE 350'],
  'Ural': ['Gear Up', 'CT', 'M70', 'Retro Solo'],
  'ИЖ': ['Планета', 'Юпитер'],
  'Минск': ['D4 125', 'C4 200', 'R250'],

  // === ГРУЗОВИКИ ===
  'КАМАЗ': ['4308', '43253', '5320', '5490', '65115', '6520', '6522'],
  'ГАЗ': ['Газель Бизнес', 'Газель Некст', 'Валдай', 'Садко'],
  'МАЗ': ['5440', '6312', '4371', '5550', '6501'],
  'Volvo': ['FH', 'FM', 'FMX', 'FL', 'FE'],
  'Scania': ['R-серия', 'S-серия', 'G-серия', 'P-серия'],
  'MAN': ['TGX', 'TGS', 'TGL', 'TGM'],
  'DAF': ['XF', 'CF', 'LF'],
  'Isuzu': ['NPR', 'NQR', 'ELF', 'Forward'],
  'Hino': ['300', '500', '700'],
  'Iveco': ['Daily', 'Eurocargo', 'Stralis', 'Trakker'],
  'Renault Trucks': ['Premium', 'Magnum', 'Kerax', 'T'],
  'Foton': ['Auman', 'Forland'],
  'Shacman': ['F3000', 'X3000'],
  'Howo': ['A7', '371', 'Sinotruk'],
  'Урал': ['4320', '5557', 'Next'],
  'ЗИЛ': ['130', '4331', '5301'],

  // === СПЕЦТЕХНИКА ===
  'JCB': ['3CX', '4CX', 'JS205', 'JS305', '535-125', '541-70'],
  'CAT': ['320', '330', '336', '966', '950', '140K', '432F'],
  'Komatsu': ['PC200', 'PC300', 'PC400', 'WA320', 'D65'],
  'Hitachi': ['ZX200', 'ZX330', 'ZX470', 'ZW180'],
  'Bobcat': ['S530', 'S650', 'S770', 'E35', 'E50'],
  'XCMG': ['XE215', 'XE250', 'LW500', 'QY25K'],
  'LiuGong': ['CLG856', 'CLG922', 'CLG936'],
  'Doosan': ['DX225', 'DX300', 'DL250'],
  'Volvo CE': ['EC210', 'EC250', 'L60', 'L90'],
  'Liebherr': ['R924', 'R934', 'L566'],
  'Terex': ['TA300', 'TA400'],
  'Zoomlion': ['ZE215', 'ZE305', 'ZTC250'],
  'SANY': ['SY215', 'SY335', 'STC250'],
  'Кировец': ['K-700', 'K-744', 'K-525'],
  'ЧТЗ': ['Б10', 'Б11', 'Т-170'],
  'Амкодор': ['342', '352', '702'],

  // === ВОДНЫЙ ===
  'Mercury': ['F 2.5', 'F 5', 'F 15', 'F 40', 'F 60', 'F 115'],
  'Tohatsu': ['MFS 5', 'MFS 9.8', 'MFS 15', 'MFS 30'],
  'BRP': ['Sea-Doo Spark', 'Sea-Doo GTI', 'Sea-Doo RXP', 'Sea-Doo RXT'],
  'Polaris': ['Jet Ski', 'RZR', 'Ranger'],
};

// ============ ЭЛЕКТРОНИКА ============

export const ELECTRONICS_BRANDS = {
  smartphone: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Honor', 'Realme', 'Oppo', 'Vivo', 'Google', 'Nokia', 'Sony', 'Asus', 'OnePlus', 'Tecno', 'Infinix', 'Motorola'],
  laptop: ['Apple', 'Lenovo', 'HP', 'Dell', 'Asus', 'Acer', 'MSI', 'Samsung', 'Huawei', 'Xiaomi', 'Honor', 'Toshiba', 'Sony', 'Microsoft'],
  tablet: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Lenovo', 'Honor', 'Microsoft', 'Asus'],
  tv: ['Samsung', 'LG', 'Sony', 'Philips', 'Xiaomi', 'TCL', 'Hisense', 'Haier', 'Panasonic', 'Sharp', 'Toshiba'],
  headphones: ['Apple', 'Sony', 'JBL', 'Bose', 'Sennheiser', 'Samsung', 'Xiaomi', 'Marshall', 'Beats', 'Huawei', 'Honor', 'AKG'],
  console: ['Sony', 'Microsoft', 'Nintendo', 'Valve'],
  appliances: ['Bosch', 'LG', 'Samsung', 'Philips', 'Dyson', 'Redmond', 'Tefal', 'Haier', 'Beko', 'Indesit', 'Whirlpool', 'Electrolux', 'Miele', 'Gorenje'],
  other: ['Apple', 'Samsung', 'Xiaomi', 'Sony', 'LG', 'Huawei', 'Honor', 'Asus', 'Acer', 'Lenovo', 'HP', 'Dell', 'Philips', 'Bosch', 'Dyson'],
};

// ============ ОДЕЖДА ============

export const CLOTHING_BRANDS = [
  'Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance', 'Asics', 'Under Armour',
  'Zara', 'H&M', 'Uniqlo', 'Levi\'s', 'Tommy Hilfiger', 'Calvin Klein',
  'Lacoste', 'The North Face', 'Columbia', 'Gucci', 'Prada', 'Louis Vuitton',
  'Balenciaga', 'Burberry', 'Dior', 'Chanel', 'Hermes',
  'Baon', 'O\'STIN', 'Befree', 'Gloria Jeans', 'Zarina', 'Твоё', 'Finn Flare',
  'Ecco', 'Geox', 'Clarks', 'Timberland', 'Dr. Martens', 'Crocs',
];

// ============ ДОМ И САД ============

export const HOME_BRANDS = [
  'IKEA', 'Hoff', 'Леруа Мерлен', 'Bosch', 'Makita', 'DeWalt', 'Metabo',
  'Black+Decker', 'Stanley', 'Зубр', 'Интерскол', 'Hammer', 'Patriot',
  'Philips', 'Xiaomi', 'Redmond', 'Tefal', 'Pioneer', 'Bork',
  'Karcher', 'Gardena', 'Fiskars', 'Husqvarna', 'Stihl', 'Champion',
];

// ============ ХОББИ ============

export const HOBBY_BRANDS = [
  'Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour', 'Columbia',
  'The North Face', 'Salomon', 'Mammut', 'Tatonka',
  'Yamaha', 'Casio', 'Roland', 'Korg', 'Fender', 'Gibson', 'Ibanez',
  'Decathlon', 'Kettler', 'Domyos',
];

// ============ УТИЛИТА ============

// Получить список брендов по ключу каталога + фильтру (для dependent-полей)
export function getCatalogList(catalogKey, filterValue) {
  const catalogs = {
    VEHICLE_BRANDS,
    VEHICLE_MODELS,
    ELECTRONICS_BRANDS,
    CLOTHING_BRANDS,
    HOME_BRANDS,
    HOBBY_BRANDS,
  };

  const catalog = catalogs[catalogKey];
  if (!catalog) return [];

  // Если это объект (зависит от ключа) — вернуть список по фильтру
  if (!Array.isArray(catalog)) {
    return catalog[filterValue] || [];
  }

  return catalog;
}