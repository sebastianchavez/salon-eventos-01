function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  if (!password || password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  return null;
}

function validatePhone(phone) {
  if (!phone || phone.trim().length < 6) return 'Teléfono inválido';
  return null;
}

function validateName(name) {
  if (!name || name.trim().length < 2) return 'Nombre demasiado corto';
  return null;
}

function loginUser(email, password) {
  const user = findUserByEmail(email);
  if (!user) return { ok: false, error: 'No existe una cuenta con este correo' };
  if (user.password !== simpleHash(password)) return { ok: false, error: 'Contraseña incorrecta' };
  setCurrentUser(user);
  return { ok: true, user };
}

function registerUser({ name, email, phone, password, acceptTerms }) {
  if (!acceptTerms) return { ok: false, error: 'Debes aceptar los términos y condiciones' };
  const nameErr = validateName(name);
  if (nameErr) return { ok: false, error: nameErr };
  if (!validateEmail(email)) return { ok: false, error: 'Correo electrónico inválido' };
  const phoneErr = validatePhone(phone);
  if (phoneErr) return { ok: false, error: phoneErr };
  const passErr = validatePassword(password);
  if (passErr) return { ok: false, error: passErr };

  if (findUserByEmail(email)) return { ok: false, error: 'Ya existe una cuenta con este correo' };

  const newUser = {
    id: 'USR-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 99),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    password: simpleHash(password),
    createdAt: new Date().toISOString()
  };
  createUser(newUser);
  return { ok: true, user: newUser };
}

function changePassword(userId, currentPassword, newPassword) {
  const user = findUserById(userId);
  if (!user) return { ok: false, error: 'Usuario no encontrado' };
  if (user.password !== simpleHash(currentPassword)) return { ok: false, error: 'La contraseña actual es incorrecta' };
  const err = validatePassword(newPassword);
  if (err) return { ok: false, error: err };
  updateUser(userId, { password: simpleHash(newPassword) });
  return { ok: true };
}

function resetPasswordByEmail(email, newPassword) {
  const user = findUserByEmail(email);
  if (!user) return { ok: false, error: 'No existe una cuenta con este correo' };
  const err = validatePassword(newPassword);
  if (err) return { ok: false, error: err };
  updateUser(user.id, { password: simpleHash(newPassword) });
  return { ok: true };
}

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const labels = ['Muy débil', 'Débil', 'Aceptable', 'Buena', 'Fuerte', 'Muy fuerte'];
  return { score, label: labels[score] || '' };
}

function isAuthenticated() {
  return !!getCurrentUser();
}

function requireAuth(redirectTo = 'login.html') {
  if (!isAuthenticated()) {
    showToast('Debes iniciar sesión para continuar', 'warning');
    setTimeout(() => { window.location.href = redirectTo; }, 800);
    return false;
  }
  return true;
}