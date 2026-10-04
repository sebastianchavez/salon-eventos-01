# Aurum·Salón — Sistema de Reservas

Template completo de sistema de reservas para salón de eventos, con **15 pantallas** funcionales, persistencia en `localStorage` y diseño elegante en paleta oscura con acentos dorados.

## Stack técnico

- **HTML5** semántico
- **Tailwind CSS** (vía CDN, sin build step)
- **JavaScript vanilla** (sin frameworks)
- **Lucide Icons** (vía CDN)
- **Google Fonts**: Playfair Display + Inter
- Sin backend — datos persistidos en `localStorage`

## Estructura del proyecto

```
salon-eventos-01/
├── index.html                      # Pantalla de inicio
├── README.md
├── assets/
│   ├── css/styles.css              # Sistema de diseño + componentes
│   ├── img/                        # (vacío, usa imágenes vía URL)
│   └── js/
│       ├── app.js                  # Bootstrap común
│       ├── auth.js                 # Login, registro, recuperación
│       ├── reservations.js         # Lógica de reservas y pagos
│       ├── storage.js              # Helpers + seed data
│       └── ui.js                   # Navbar, footer, toasts, modales
└── pages/
    ├── confirmation.html           # Confirmación de reserva
    ├── contact.html                # Contacto + mapa + horarios
    ├── forgot-password.html        # Recuperar contraseña
    ├── login.html                  # Iniciar sesión
    ├── payment-success.html        # Recibo de pago
    ├── payment.html                # Pago con tarjeta
    ├── privacy.html                # Políticas de privacidad
    ├── profile.html                # Mi perfil + historial
    ├── register.html               # Registro de usuario
    ├── reservation-detail.html     # Detalle de reserva + anular
    ├── reservation.html            # Wizard de reserva (4 pasos)
    ├── reset-password.html         # Nueva contraseña
    ├── services.html               # Catálogo de servicios
    └── terms.html                  # Términos y condiciones
```

## Pantallas

| # | Pantalla | Ruta | Autenticación |
|---|----------|------|---------------|
| 1 | Inicio | `index.html` | No |
| 2 | Servicios | `pages/services.html` | No |
| 3 | Reservar (wizard) | `pages/reservation.html` | Opcional |
| 4 | Confirmación | `pages/confirmation.html` | Opcional |
| 5 | Contacto | `pages/contact.html` | No |
| 6 | Login | `pages/login.html` | No |
| 7 | Registro | `pages/register.html` | No |
| 8 | Recuperar contraseña | `pages/forgot-password.html` | No |
| 9 | Nueva contraseña | `pages/reset-password.html` | No |
| 10 | Términos | `pages/terms.html` | No |
| 11 | Privacidad | `pages/privacy.html` | No |
| 12 | Mi perfil | `pages/profile.html` | Requerida |
| 13 | Detalle de reserva | `pages/reservation-detail.html` | Requerida |
| 14 | Pago | `pages/payment.html` | Requerida |
| 15 | Confirmación de pago | `pages/payment-success.html` | Requerida |

## Instalación

No requiere instalación ni build:

1. Descarga o clona la carpeta `salon-eventos-01/`
2. Abre `index.html` en cualquier navegador moderno (Chrome, Firefox, Edge, Safari)
3. Listo — la primera carga crea automáticamente los datos demo en `localStorage`

> **Nota:** Para una mejor experiencia usa un servidor local estático (por ejemplo `python -m http.server` o la extensión *Live Server* de VSCode) y accede vía `http://localhost:8000`. Esto evita restricciones del navegador al cargar recursos locales.

## Usuario de demostración

Al cargar por primera vez se crea automáticamente:

- **Email:** `demo@salon.com`
- **Contraseña:** `demo123`

Además, este usuario ya tiene **2 reservas** precargadas (una pagada y otra pendiente de pago) para mostrar todas las funcionalidades del historial.

## Flujos principales

### Reserva completa (sin login)
1. `index.html` → clic en "Reservar ahora"
2. Wizard de 4 pasos: evento → servicios → contacto → resumen
3. Confirmación con código generado (`RES-YYYYMMDD-XXXX`)
4. Botón "Proceder al pago"
5. Pago con tarjeta (formato y validación simulados)
6. Confirmación de pago con recibo imprimible

### Reserva con usuario registrado
1. `pages/login.html` → ingresa con `demo@salon.com` / `demo123`
2. Redirige a `pages/profile.html`
3. Aquí ves tu historial con estados (Pendiente / Pagada / Anulada)
4. Botón "Nueva reserva" inicia el mismo wizard

### Anular reserva
1. En perfil, clic en "Ver detalle" de una reserva
2. `pages/reservation-detail.html` muestra toda la información
3. Botón "Anular reserva" abre modal de confirmación
4. Política de reembolso visible según estado (pagada/pendiente)

## Datos en localStorage

| Clave | Contenido |
|-------|-----------|
| `salon_users` | Array de usuarios con password hasheado |
| `salon_currentUser` | Usuario actualmente autenticado |
| `salon_reservations` | Array de reservas con todos sus datos |
| `salon_schemaVersion` | Versión del esquema (control de migraciones) |

### Estructura de una reserva
```js
{
  id: "RES-20261004-0001",
  userId: "USR-001",
  eventType: "boda",
  eventDate: "2026-12-15",
  eventTime: "19:00",
  guests: 150,
  services: [
    { id: "S01", name: "Alquiler Salón Premium", qty: 1, price: 5500 }
  ],
  subtotal: 11750,
  tax: 2115,
  total: 13865,
  status: "pending_payment" | "paid" | "cancelled" | "completed",
  contactInfo: { name, email, phone, notes },
  payment: { method, cardLast4, paidAt } | null,
  createdAt: "ISO date",
  cancelledAt: "ISO date" | null
}
```

## Servicios del catálogo

El sistema incluye 14 servicios organizados en 6 categorías:

| Categoría | Servicios |
|-----------|-----------|
| **Salón** | Alquiler Premium (250 pers.), Alquiler Íntimo (80 pers.), Mobiliario |
| **Gastronomía** | Catering Buffet, Plato Servido, Torta Personalizada, Barra de Cocteles |
| **Decoración** | Clásica, Temática |
| **Música** | DJ Profesional, Banda en Vivo |
| **Audiovisual** | Fotografía, Video + Edición |
| **Servicio** | Coordinación del Evento |

## Personalización

### Cambiar paleta de colores
Edita las CSS variables en `assets/css/styles.css`:

```css
:root {
  --color-bg: #0f0f10;          /* Fondo principal */
  --color-gold: #c9a55c;        /* Acento dorado */
  --color-text: #f4f1ea;        /* Texto principal */
  /* ... */
}
```

### Agregar más servicios
Edita el array `CATALOG_SERVICES` en `assets/js/storage.js`. Cada servicio requiere:

```js
{
  id: 'SXX',
  name: 'Nombre del servicio',
  category: 'salon' | 'gastronomia' | 'decoracion' | 'musica' | 'audiovisual' | 'servicio',
  price: 1000,
  unit: 'evento' | 'persona' | 'unidad' | 'silla',
  description: 'Descripción detallada',
  icon: 'nombre-icono-lucide'
}
```

### Cambiar textos legales
Edita directamente `pages/terms.html` y `pages/privacy.html` — el contenido está marcado con secciones claramente etiquetadas.

## Características de UX

- **Wizard de reserva** con validación por paso y resumen en tiempo real
- **Tarjeta de crédito animada** que refleja los datos al escribir
- **Medidor de fuerza de contraseña** visual durante el registro
- **Validación de tarjeta** (formato, fecha, CVV) con detección de marca (Visa/Mastercard/Amex)
- **Modales de confirmación** para acciones destructivas (anular reserva)
- **Toasts** para notificaciones no intrusivas
- **Recibo imprimible** con estilos `@media print` optimizados
- **Mobile-first** responsive con menú hamburguesa
- **Scroll reveal** con IntersectionObserver
- **Estados visuales** con badges (amarillo=pendiente, verde=pagada, rojo=anulada)

## Compatibilidad

- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

Requiere JavaScript habilitado y soporte para `localStorage`.

## Limitaciones

- **No es producción:** El hash de contraseñas es simple (solo demo). En un sistema real usa bcrypt en backend.
- **Sin backend:** Los datos viven en el navegador del usuario. Cada navegador/dispositivo tiene sus propios datos.
- **Pago simulado:** No se conecta con ninguna pasarela real. Solo demuestra el flujo.
- **Imágenes externas:** El hero usa Unsplash como placeholder.

## Licencia

Template de uso libre. Personaliza y distribuye sin restricciones.

---

**Aurum·Salón** — Donde los momentos extraordinarios cobran vida.