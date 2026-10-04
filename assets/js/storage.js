const STORAGE_KEYS = {
  USERS: 'salon_users',
  CURRENT_USER: 'salon_currentUser',
  RESERVATIONS: 'salon_reservations',
  SERVICES: 'salon_services',
  SCHEMA_VERSION: 'salon_schemaVersion'
};

const SCHEMA_VERSION = '1.0.0';

const CATALOG_SERVICES = [
  { id: 'S01', name: 'Alquiler Salón Premium', category: 'salon', price: 5500, unit: 'evento', description: 'Salón principal con capacidad hasta 250 personas, iluminación LED y sistema de sonido integrado.', icon: 'building' },
  { id: 'S02', name: 'Alquiler Salón Íntimo', category: 'salon', price: 3200, unit: 'evento', description: 'Espacio acogedor para eventos de hasta 80 personas, ideal para reuniones familiares.', icon: 'home' },
  { id: 'S03', name: 'Catering Buffet Premium', category: 'gastronomia', price: 85, unit: 'persona', description: 'Buffet completo con entrada, plato fuerte, postre y bebida. Chef especializado en eventos.', icon: 'utensils' },
  { id: 'S04', name: 'Catering Plato Servido', category: 'gastronomia', price: 120, unit: 'persona', description: 'Servicio de mesa con menú gourmet de 3 tiempos y maridaje.', icon: 'utensils-crossed' },
  { id: 'S05', name: 'Decoración Clásica', category: 'decoracion', price: 1800, unit: 'evento', description: 'Centros de mesa, arreglos florales y ambientación elegante.', icon: 'flower' },
  { id: 'S06', name: 'Decoración Temática', category: 'decoracion', price: 2800, unit: 'evento', description: 'Decoración personalizada según la temática de tu evento.', icon: 'sparkles' },
  { id: 'S07', name: 'DJ Profesional', category: 'musica', price: 1200, unit: 'evento', description: 'DJ con equipo de sonido profesional y luces LED. 5 horas incluidas.', icon: 'music' },
  { id: 'S08', name: 'Banda en Vivo', category: 'musica', price: 3500, unit: 'evento', description: 'Banda musical versátil con repertorio personalizado.', icon: 'music-2' },
  { id: 'S09', name: 'Fotografía Profesional', category: 'audiovisual', price: 1500, unit: 'evento', description: 'Cobertura completa con fotógrafo profesional y entrega digital.', icon: 'camera' },
  { id: 'S10', name: 'Video y Edición', category: 'audiovisual', price: 2200, unit: 'evento', description: 'Video cinematográfico del evento con edición profesional y drone.', icon: 'video' },
  { id: 'S11', name: 'Torta Personalizada', category: 'gastronomia', price: 450, unit: 'unidad', description: 'Torta de fondant diseñada a medida, hasta 3 pisos.', icon: 'cake' },
  { id: 'S12', name: 'Mobiliario Adicional', category: 'salon', price: 35, unit: 'silla', description: 'Sillas Tiffany, mesas rectangulares y redondas adicionales.', icon: 'armchair' },
  { id: 'S13', name: 'Coordinación del Evento', category: 'servicio', price: 800, unit: 'evento', description: 'Coordinador profesional que gestiona todos los detalles el día del evento.', icon: 'clipboard-list' },
  { id: 'S14', name: 'Barra de Cocteles', category: 'gastronomia', price: 950, unit: 'evento', description: 'Bartender profesional con barra móvil y coctelería de autor.', icon: 'glass-water' }
];

function checkSchema() {
  const current = localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION);
  if (current !== SCHEMA_VERSION) {
    localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, SCHEMA_VERSION);
  }
}

function getUsers() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || []; }
  catch (e) { return []; }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function findUserByEmail(email) {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

function findUserById(id) {
  return getUsers().find(u => u.id === id) || null;
}

function createUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
  return user;
}

function updateUser(id, updates) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  return users[idx];
}

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)); }
  catch (e) { return null; }
}

function setCurrentUser(user) {
  if (user) {
    const { password, ...safe } = user;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safe));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

function logout() { setCurrentUser(null); }

function getReservations(userId = null) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) || [];
    return userId ? all.filter(r => r.userId === userId) : all;
  } catch (e) { return []; }
}

function saveReservation(reservation) {
  const all = getReservations();
  const idx = all.findIndex(r => r.id === reservation.id);
  if (idx >= 0) all[idx] = reservation;
  else all.push(reservation);
  localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(all));
  return reservation;
}

function getReservationById(id) {
  return getReservations().find(r => r.id === id) || null;
}

function updateReservationStatus(id, status, extra = {}) {
  const res = getReservationById(id);
  if (!res) return null;
  res.status = status;
  Object.assign(res, extra);
  return saveReservation(res);
}

function getServicesCatalog() {
  return CATALOG_SERVICES;
}

function getServiceById(id) {
  return CATALOG_SERVICES.find(s => s.id === id) || null;
}

function seedData() {
  checkSchema();

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const demoUser = {
      id: 'USR-001',
      name: 'María González',
      email: 'demo@salon.com',
      phone: '+51 999 888 777',
      password: simpleHash('demo123'),
      createdAt: new Date().toISOString()
    };
    saveUsers([demoUser]);
  }

  if (!localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) {
    const user = findUserByEmail('demo@salon.com');
    if (user) {
      const reservations = [
        {
          id: 'RES-20260820-0001',
          userId: user.id,
          eventType: 'Boda',
          eventDate: '2026-11-15',
          eventTime: '19:00',
          guests: 180,
          services: [
            { id: 'S01', name: 'Alquiler Salón Premium', qty: 1, price: 5500 },
            { id: 'S03', name: 'Catering Buffet Premium', qty: 180, price: 85 },
            { id: 'S05', name: 'Decoración Clásica', qty: 1, price: 1800 },
            { id: 'S07', name: 'DJ Profesional', qty: 1, price: 1200 }
          ],
          subtotal: 23800,
          tax: 4274,
          total: 28074,
          status: 'paid',
          contactInfo: { name: user.name, email: user.email, phone: user.phone, notes: 'Boda al aire libre con ceremonia.' },
          payment: { method: 'credit_card', cardLast4: '4242', paidAt: '2026-08-22T14:30:00.000Z' },
          createdAt: '2026-08-20T10:15:00.000Z',
          cancelledAt: null
        },
        {
          id: 'RES-20261001-0002',
          userId: user.id,
          eventType: 'Cumpleaños',
          eventDate: '2026-12-20',
          eventTime: '20:00',
          guests: 60,
          services: [
            { id: 'S02', name: 'Alquiler Salón Íntimo', qty: 1, price: 3200 },
            { id: 'S04', name: 'Catering Plato Servido', qty: 60, price: 120 },
            { id: 'S06', name: 'Decoración Temática', qty: 1, price: 2800 },
            { id: 'S11', name: 'Torta Personalizada', qty: 1, price: 450 }
          ],
          subtotal: 13650,
          tax: 2451,
          total: 16101,
          status: 'pending_payment',
          contactInfo: { name: user.name, email: user.email, phone: user.phone, notes: 'Cumpleaños temático de los 30.' },
          payment: null,
          createdAt: '2026-10-01T16:45:00.000Z',
          cancelledAt: null
        }
      ];
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    }
  }
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36);
}