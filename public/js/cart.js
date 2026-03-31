
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}


function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}


function addToCart(item) {
    let cart = getCart();
    const existingIndex = cart.findIndex(i => i.id === item.id && i.type === item.type);
    if (existingIndex !== -1) {
        cart[existingIndex].quantity += item.quantity;
    } else {
        cart.push(item);
    }
    saveCart(cart);
    alert('تمت إضافة المنتج إلى السلة');
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


function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountSpan = document.getElementById('cart-count');
    if (cartCountSpan) cartCountSpan.innerText = totalItems;
}


document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});


function getCart() { return JSON.parse(localStorage.getItem('cart') || '[]'); }
function saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); updateCartCount(); }

function addToCart(item) {
    
    if (confirm(`هل أنت متأكد من إضافة "${item.name}" إلى السلة؟`)) {
        let cart = getCart();
        const existingIndex = cart.findIndex(i => i.id === item.id && i.type === item.type);
        if (existingIndex !== -1) {
            cart[existingIndex].quantity += item.quantity;
        } else {
            cart.push(item);
        }
        saveCart(cart);
        alert('تمت الإضافة إلى السلة');
    }
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountSpan = document.getElementById('cart-count');
    if (cartCountSpan) cartCountSpan.innerText = totalItems;
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
    
    if (typeof renderCart === 'function') renderCart();
}