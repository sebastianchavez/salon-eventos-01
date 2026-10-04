const TAX_RATE = 0.18;

function generateReservationId() {
  const now = new Date();
  const yyyymmdd = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const count = getReservations().filter(r => r.id.startsWith(`RES-${yyyymmdd}`)).length + 1;
  return `RES-${yyyymmdd}-${String(count).padStart(4, '0')}`;
}

function calculateSubtotal(services) {
  return services.reduce((sum, s) => sum + (s.price * s.qty), 0);
}

function calculateTax(subtotal) { return Math.round(subtotal * TAX_RATE); }

function calculateTotal(services) {
  const subtotal = calculateSubtotal(services);
  return { subtotal, tax: calculateTax(subtotal), total: subtotal + calculateTax(subtotal) };
}

function createReservation(data) {
  const currentUser = getCurrentUser();
  const totals = calculateTotal(data.services);
  const reservation = {
    id: generateReservationId(),
    userId: currentUser ? currentUser.id : 'GUEST',
    eventType: data.eventType,
    eventDate: data.eventDate,
    eventTime: data.eventTime,
    guests: parseInt(data.guests),
    services: data.services,
    subtotal: totals.subtotal,
    tax: totals.tax,
    total: totals.total,
    status: 'pending_payment',
    contactInfo: data.contactInfo,
    payment: null,
    createdAt: new Date().toISOString(),
    cancelledAt: null
  };
  saveReservation(reservation);
  return reservation;
}

function cancelReservation(id) {
  return updateReservationStatus(id, 'cancelled', { cancelledAt: new Date().toISOString() });
}

function payReservation(id, cardData) {
  return updateReservationStatus(id, 'paid', {
    payment: {
      method: 'credit_card',
      cardLast4: cardData.number.replace(/\s/g, '').slice(-4),
      paidAt: new Date().toISOString()
    }
  });
}

function getReservationStatusLabel(status) {
  const map = {
    pending_payment: 'Pendiente de pago',
    paid: 'Pagada',
    cancelled: 'Anulada',
    completed: 'Completada'
  };
  return map[status] || status;
}

function getReservationStatusBadge(status) {
  return `<span class="badge badge-${status === 'pending_payment' ? 'pending' : status}">${getReservationStatusLabel(status)}</span>`;
}

function getEventTypeLabel(type) {
  const map = {
    boda: 'Boda',
    corporativo: 'Evento Corporativo',
    cumpleanos: 'Cumpleaños',
    aniversario: 'Aniversario',
    graduacion: 'Graduación',
    otro: 'Otro'
  };
  return map[type] || type;
}

function validateCardData({ number, name, expiry, cvv }) {
  const errors = {};
  const num = number.replace(/\s/g, '');
  if (!num || !/^\d{13,19}$/.test(num)) errors.number = 'Número de tarjeta inválido';
  if (!name || name.trim().length < 3) errors.name = 'Nombre del titular requerido';
  if (!expiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) errors.expiry = 'Fecha inválida (MM/AA)';
  if (!cvv || !/^\d{3,4}$/.test(cvv)) errors.cvv = 'CVV inválido';
  return errors;
}

function formatCardNumber(value) {
  return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 23);
}

function formatExpiry(value) {
  const clean = value.replace(/\D/g, '').slice(0, 4);
  if (clean.length >= 3) return clean.slice(0, 2) + '/' + clean.slice(2);
  return clean;
}

function getCardBrand(number) {
  const num = number.replace(/\s/g, '');
  if (/^4/.test(num)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(num)) return 'mastercard';
  if (/^3[47]/.test(num)) return 'amex';
  return 'generic';
}