function formatCurrency(amount) {
  return 'S/ ' + Number(amount).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr, withTime = false) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const formatted = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  if (withTime) {
    formatted += ` ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  return formatted;
}

function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: 'check-circle', error: 'x-circle', warning: 'alert-triangle', info: 'info' };
  const colors = { success: 'text-green-400', error: 'text-red-400', warning: 'text-yellow-400', info: 'text-blue-400' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i data-lucide="${icons[type]}" class="w-5 h-5 ${colors[type]} flex-shrink-0"></i>
    <span class="text-sm flex-1">${message}</span>
  `;
  container.appendChild(toast);
  if (typeof lucide !== 'undefined') lucide.createIcons();
  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function openModal(html) {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modalOverlay';
  overlay.innerHTML = `<div class="modal-content">${html}</div>`;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add('active'), 10);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeModal() {
  const existing = document.getElementById('modalOverlay');
  if (existing) {
    existing.classList.remove('active');
    setTimeout(() => existing.remove(), 200);
  }
}

function getInitials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).slice(0, 2).map(s => s[0]).join('').toUpperCase();
}

function setFieldError(formGroup, message) {
  if (typeof formGroup === 'string') formGroup = document.querySelector(formGroup);
  if (!formGroup) return;
  formGroup.classList.add('error');
  const errEl = formGroup.querySelector('.form-error');
  if (errEl && message) errEl.textContent = message;
}

function clearErrors(form) {
  if (typeof form === 'string') form = document.querySelector(form);
  if (!form) return;
  form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
}

function renderNavbar(activePage = '') {
  const currentUser = getCurrentUser();
  const path = window.location.pathname;
  const inPagesDir = path.includes('/pages/');
  const rootBase = inPagesDir ? '../' : '';
  const pagesBase = inPagesDir ? '' : 'pages/';

  const navItems = [
    { href: 'index.html', label: 'Inicio', page: 'index' },
    { href: 'services.html', label: 'Servicios', page: 'services' },
    { href: 'reservation.html', label: 'Reservar', page: 'reservation' },
    { href: 'contact.html', label: 'Contacto', page: 'contact' }
  ];

  const buildHref = (href) => href === 'index.html' ? rootBase + 'index.html' : pagesBase + href;

  const navHtml = navItems.map(item => {
    const fullHref = buildHref(item.href);
    const isActive = activePage === item.page;
    return `<a href="${fullHref}" class="nav-link ${isActive ? 'active' : ''}">${item.label}</a>`;
  }).join('');

  const userArea = currentUser
    ? `<div class="flex items-center gap-3">
         <a href="${pagesBase}profile.html" class="nav-link flex items-center gap-2">
           <div class="avatar">${getInitials(currentUser.name)}</div>
           <span class="hidden md:inline text-sm">${currentUser.name.split(' ')[0]}</span>
         </a>
       </div>`
    : `<div class="flex items-center gap-2">
         <a href="${pagesBase}login.html" class="nav-link">Ingresar</a>
         <a href="${pagesBase}reservation.html" class="btn btn-primary !py-1.5 !px-4 !text-sm">Reservar</a>
       </div>`;

  return `
    <nav class="navbar">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <a href="${rootBase}index.html" class="brand-mark">
            <i data-lucide="crown" class="w-6 h-6 text-gold"></i>
            <span>Aurum<span>·Salón</span></span>
          </a>
          <div class="desktop-only flex items-center gap-2">
            ${navHtml}
          </div>
          <div class="desktop-only flex items-center gap-3">
            ${userArea}
          </div>
          <button class="mobile-only text-gold p-2" onclick="toggleMobileMenu()" aria-label="Menú">
            <i data-lucide="menu" class="w-6 h-6"></i>
          </button>
        </div>
      </div>
    </nav>
    <div class="mobile-menu" id="mobileMenu">
      <button onclick="toggleMobileMenu()" class="absolute top-5 right-5 text-gold">
        <i data-lucide="x" class="w-6 h-6"></i>
      </button>
      ${navItems.map(item => {
        return `<a href="${buildHref(item.href)}" class="nav-link">${item.label}</a>`;
      }).join('')}
      ${currentUser
        ? `<a href="${pagesBase}profile.html" class="nav-link">Mi Perfil</a>
             <button onclick="handleLogout();" class="nav-link text-left">Cerrar sesión</button>`
        : `<a href="${pagesBase}login.html" class="nav-link">Ingresar</a>
             <a href="${pagesBase}register.html" class="nav-link">Registrarse</a>`}
    </div>
  `;
}

function toggleMobileMenu() {
  document.getElementById('mobileMenu')?.classList.toggle('active');
}

function handleLogout() {
  logout();
  showToast('Sesión cerrada', 'info');
  const path = window.location.pathname;
  const inPages = path.includes('/pages/');
  setTimeout(() => { window.location.href = (inPages ? '../' : '') + 'index.html'; }, 600);
}

function renderFooter() {
  const path = window.location.pathname;
  const inPagesDir = path.includes('/pages/');
  const base = inPagesDir ? '../' : '';

  return `
    <footer class="bg-alt border-t border-subtle mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="brand-mark mb-4"><i data-lucide="crown" class="w-5 h-5 text-gold"></i><span>Aurum<span>·Salón</span></span></div>
            <p class="text-sm text-muted leading-relaxed">El escenario ideal para los momentos más importantes de tu vida.</p>
          </div>
          <div>
            <h4 class="font-serif text-gold mb-4 text-base">Navegación</h4>
            <ul class="space-y-2 text-sm text-muted">
              <li><a href="${base}index.html" class="hover:text-gold transition">Inicio</a></li>
              <li><a href="${base}pages/services.html" class="hover:text-gold transition">Servicios</a></li>
              <li><a href="${base}pages/reservation.html" class="hover:text-gold transition">Reservar</a></li>
              <li><a href="${base}pages/contact.html" class="hover:text-gold transition">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-serif text-gold mb-4 text-base">Legal</h4>
            <ul class="space-y-2 text-sm text-muted">
              <li><a href="${base}pages/terms.html" class="hover:text-gold transition">Términos y condiciones</a></li>
              <li><a href="${base}pages/privacy.html" class="hover:text-gold transition">Políticas de privacidad</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-serif text-gold mb-4 text-base">Contacto</h4>
            <ul class="space-y-2 text-sm text-muted">
              <li class="flex items-center gap-2"><i data-lucide="map-pin" class="w-4 h-4 text-gold"></i>Av. El Sol 123, Cusco</li>
              <li class="flex items-center gap-2"><i data-lucide="phone" class="w-4 h-4 text-gold"></i>+51 84 123 456</li>
              <li class="flex items-center gap-2"><i data-lucide="mail" class="w-4 h-4 text-gold"></i>contacto@aurum.com</li>
            </ul>
          </div>
        </div>
        <div class="divider-gold my-8"></div>
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-dim">
          <p>© ${new Date().getFullYear()} Aurum·Salón. Todos los derechos reservados.</p>
          <div class="flex gap-3">
            <a href="#" class="hover:text-gold transition"><i data-lucide="instagram" class="w-4 h-4"></i></a>
            <a href="#" class="hover:text-gold transition"><i data-lucide="facebook" class="w-4 h-4"></i></a>
            <a href="#" class="hover:text-gold transition"><i data-lucide="twitter" class="w-4 h-4"></i></a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

function initLayout(activePage) {
  seedData();
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';
  const pageMap = {
    'index.html': 'index',
    'services.html': 'services',
    'reservation.html': 'reservation',
    'confirmation.html': 'reservation',
    'contact.html': 'contact',
    'login.html': '',
    'register.html': '',
    'forgot-password.html': '',
    'reset-password.html': '',
    'terms.html': 'terms',
    'privacy.html': 'privacy',
    'profile.html': 'profile',
    'reservation-detail.html': 'profile',
    'payment.html': 'profile',
    'payment-success.html': 'profile'
  };
  const detectedPage = pageMap[filename] || activePage || '';

  const navHost = document.getElementById('navbar');
  const footerHost = document.getElementById('footer');
  if (navHost) navHost.innerHTML = renderNavbar(detectedPage);
  if (footerHost) footerHost.innerHTML = renderFooter();
  if (typeof lucide !== 'undefined') lucide.createIcons();
  initScrollReveal();
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}