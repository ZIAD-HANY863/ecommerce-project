
function getCart() { return JSON.parse(localStorage.getItem('cart') || '[]'); }
function saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); updateCartCount(); }

const ADMIN_EMAILS = ['admin@butchershop.com', 'admin@freshmenu.com'];
const ADMIN_PASSWORD = 'FreshMenu123';

function isAdminEmail(email) {
    return ADMIN_EMAILS.includes(email.toLowerCase());
}

function getCurrentUser() { return JSON.parse(localStorage.getItem('user') || 'null'); }
function saveUser(user) { localStorage.setItem('user', JSON.stringify(user)); }
function logout() {
    localStorage.removeItem('user');
    updateNavbarAuth();
    if (window.location.pathname.endsWith('admin.html')) {
        window.location.href = 'login.html';
    }
}

function updateNavbarAuth() {
    const user = getCurrentUser();
    const loginLink = document.getElementById('nav-login');
    const logoutBtn = document.getElementById('nav-logout');
    const adminLink = document.getElementById('nav-admin');
    const loginLinkMobile = document.getElementById('nav-login-mobile');
    const logoutBtnMobile = document.getElementById('nav-logout-mobile');
    const adminLinkMobile = document.getElementById('nav-admin-mobile');

    if (user && user.email) {
        if (loginLink) loginLink.style.display = 'none';
        if (loginLinkMobile) loginLinkMobile.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-flex';
        if (logoutBtnMobile) logoutBtnMobile.style.display = 'inline-flex';
        if (isAdminEmail(user.email)) {
            if (adminLink) adminLink.style.display = 'inline-flex';
            if (adminLinkMobile) adminLinkMobile.style.display = 'inline-flex';
        } else {
            if (adminLink) adminLink.style.display = 'none';
            if (adminLinkMobile) adminLinkMobile.style.display = 'none';
        }
    } else {
        if (loginLink) loginLink.style.display = 'inline-flex';
        if (loginLinkMobile) loginLinkMobile.style.display = 'inline-flex';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (logoutBtnMobile) logoutBtnMobile.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
        if (adminLinkMobile) adminLinkMobile.style.display = 'none';
    }
}

function addToCart(item) {
    const displayName = item.name_en || item.name_ar || item.name || 'item';
    if (confirm(`هل أنت متأكد من إضافة "${displayName}" إلى السلة؟`)) {
        let cart = getCart();
        const existingIndex = cart.findIndex(i => i.id === item.id && i.type === item.type);
        if (existingIndex !== -1) {
            cart[existingIndex].quantity += item.quantity;
        } else {
            cart.push({
                ...item,
                productId: item.productId || item.id,
            });
        }
        saveCart(cart);
        alert('تمت الإضافة إلى السلة');
    }
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountSpan = document.getElementById('cart-count');
    const cartCountMobile = document.getElementById('cart-count-mobile');
    if (cartCountSpan) cartCountSpan.innerText = totalItems;
    if (cartCountMobile) cartCountMobile.innerText = totalItems;
}

function updateQuantity(index, quantity) {
    let cart = getCart();
    if (cart[index]) {
        cart[index].quantity = quantity;
        saveCart(cart);
    }
}

function removeItem(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}


function initDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) document.documentElement.classList.add('dark');
    const toggleBtn = document.getElementById('dark-mode-toggle');
    const toggleMobile = document.getElementById('dark-mode-toggle-mobile');
    const updateIcons = () => {
        const isDark = document.documentElement.classList.contains('dark');
        if (toggleBtn) toggleBtn.textContent = isDark ? '☀️' : '🌙';
        if (toggleMobile) toggleMobile.textContent = isDark ? '☀️' : '🌙';
    };
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
            updateIcons();
        });
    }
    if (toggleMobile) {
        toggleMobile.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
            updateIcons();
        });
    }
    updateIcons();
}


function setupMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('show');
        });
        
        menu.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('click', () => {
                menu.classList.remove('show');
            });
        });
    }
}


async function loadNavbar() {
    try {
        const response = await fetch('navbar.html');
        const navbarHTML = await response.text();
        document.body.insertAdjacentHTML('afterbegin', navbarHTML);
        initDarkMode();
        updateCartCount();
        setupMobileMenu();
        updateNavbarAuth();
        applyTranslations();
    } catch (error) {
        console.error('خطأ في تحميل الناف:', error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
});


document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        document.body.style.transition = 'opacity 0.3s';
        document.body.style.opacity = '0';
        setTimeout(() => {
            window.location.href = link.href;
        }, 300);
    }
});

let currentLang = localStorage.getItem('lang') || 'ar';

function applyTranslations() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            el.innerText = translations[currentLang][key];
        }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[currentLang] && translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) langBtn.textContent = currentLang === 'ar' ? '🇬🇧 English' : '🇸🇦 العربية';
    const langBtnMobile = document.getElementById('lang-toggle-mobile');
    if (langBtnMobile) langBtnMobile.textContent = currentLang === 'ar' ? '🇬🇧 English' : '🇸🇦 العربية';
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations();
    if (typeof window.onLanguageChanged === 'function') {
        window.onLanguageChanged();
    }
}


document.addEventListener('click', (e) => {
    if (e.target.id === 'lang-toggle' || e.target.id === 'lang-toggle-mobile') {
        setLanguage(currentLang === 'ar' ? 'en' : 'ar');
        return;
    }
    if (e.target.id === 'nav-logout' || e.target.id === 'nav-logout-mobile') {
        e.preventDefault();
        logout();
        return;
    }
});


document.addEventListener('DOMContentLoaded', () => {
    
    setTimeout(() => applyTranslations(), 100);
});