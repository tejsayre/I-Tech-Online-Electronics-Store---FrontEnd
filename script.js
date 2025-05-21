let isSignedUp = false;
let isLoggedIn = false;
let registeredUser = '';
let registeredPass = '';
let cart = [];
let orderHistory = [];

// Modal functions
function showModal() {
    document.getElementById('authModal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('authMsg').innerText = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Auth functions
function login() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    if (!isSignedUp) {
        document.getElementById('authMsg').innerText = 'Please sign up first before logging in.';
        return;
    }
    if (user === registeredUser && pass === registeredPass) {
        isLoggedIn = true;
        closeModal();
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) loginBtn.style.display = 'none';
        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) {
            userDisplay.textContent = `Welcome, ${user}!`;
            userDisplay.style.display = 'inline';
        }
        document.querySelector('.navbar').classList.add('center-nav');
        showNotification('Login successful!');
    } else {
        document.getElementById('authMsg').innerText = 'Incorrect username or password.';
    }
}
function signup() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    if (user && pass) {
        registeredUser = user;
        registeredPass = pass;
        isSignedUp = true;
        document.getElementById('authMsg').innerText = 'Sign up successful! You can now log in.';
    } else {
        document.getElementById('authMsg').innerText = 'Please enter username and password to sign up.';
    }
}

// Cart functions
function showCart() {
    const cartModal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
        cartItems.innerHTML = '<li>Your cart is empty.</li>';
    } else {
        cart.forEach((item, idx) => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.alignItems = 'center';
            li.style.justifyContent = 'space-between';
            li.style.marginBottom = '0.5rem';
            li.innerHTML = `
            <span style="display:flex; align-items:center; gap:10px;">
                <img src="${item.img}" alt="${item.name}" style="width:40px; height:40px; object-fit:cover; border-radius:5px;">
                <span>
                    <strong>${item.name}</strong> x${item.qty}
                    <span style="color:gray;">(${item.price})</span>
                </span>
            </span>
            <span>
                <button onclick="removeFromCart(${idx})" style="background:#e53935; color:white; border:none; padding:5px 12px; border-radius:4px; cursor:pointer; font-size:1rem;">
                    Remove
                </button>
            </span>
            `;
            cartItems.appendChild(li);
            total += item.qty * parseFloat(item.price.replace(/[^0-9.]/g, ''));
        });
        const totalLi = document.createElement('li');
        totalLi.style.marginTop = '1rem';
        totalLi.style.fontWeight = 'bold';
        totalLi.innerHTML = `Total: $${total.toFixed(2)}`;
        cartItems.appendChild(totalLi);
        const purchaseBtn = document.createElement('button');
        purchaseBtn.textContent = 'Purchase';
        purchaseBtn.className = 'btn';
        purchaseBtn.style.marginTop = '1rem';
        purchaseBtn.onclick = function() {
            if (cart.length === 0) return;
            orderHistory.push({
                date: new Date().toLocaleString(),
                items: cart.map(item => ({ ...item }))
            });
            showNotification('Thank you for your purchase!');
            cart = [];
            showCart();
        };
        cartItems.appendChild(purchaseBtn);
    }
    cartModal.style.display = 'flex';
}
window.removeFromCart = function(idx) {
    cart.splice(idx, 1);
    showCart();
};
function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

// Add to Cart logic
document.querySelectorAll('.btn').forEach(btn => {
    if (btn.textContent.trim() === 'Add to Cart') {
        btn.addEventListener('click', function(e) {
            if (!isLoggedIn) {
                e.preventDefault();
                showModal();
            } else {
                const card = btn.closest('.product-card');
                const name = card.querySelector('h3').textContent;
                const price = card.querySelector('.product-price').textContent;
                const img = card.querySelector('.product-image') ? card.querySelector('.product-image').src : '';
                const found = cart.find(item => item.name === name && item.price === price);
                if (found) {
                    found.qty += 1;
                } else {
                    cart.push({ name, price, img, qty: 1 });
                }
                showNotification('Added to cart!');
            }
        });
    }
});

// Navbar Cart button opens cart modal
document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === '#cart') {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showCart();
        });
    }
});

// Login button opens modal
document.querySelectorAll('.btn').forEach(btn => {
    if (btn.textContent.trim().includes('Login')) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            showModal();
        });
    }
});

// Notification popup
function showNotification(message, duration = 2500) {
    const notif = document.getElementById('notification');
    notif.textContent = message;
    notif.classList.add('show');
    notif.style.display = 'block';
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => {
            notif.style.display = 'none';
        }, 500);
    }, duration);
}

// Order History
function showOrderHistory() {
    const modal = document.getElementById('orderHistoryModal');
    const list = document.getElementById('orderHistoryList');
    list.innerHTML = '';
    if (orderHistory.length === 0) {
        list.innerHTML = '<li>No orders yet.</li>';
    } else {
        orderHistory.slice().reverse().forEach(order => {
            const li = document.createElement('li');
            li.style.marginBottom = '1rem';
            li.innerHTML = `<strong>${order.date}</strong><ul style="margin-left:1rem;">${
                order.items.map(item =>
                    `<li>
                        <img src="${item.img}" alt="${item.name}" style="width:30px; height:30px; object-fit:cover; border-radius:4px; vertical-align:middle; margin-right:8px;">
                        ${item.name} x${item.qty} <span style="color:gray;">(${item.price})</span>
                    </li>`
                ).join('')
            }</ul>`;
            list.appendChild(li);
        });
    }
    modal.style.display = 'flex';
}
function closeOrderHistory() {
    document.getElementById('orderHistoryModal').style.display = 'none';
}
document.getElementById('orderHistoryLink').addEventListener('click', function(e) {
    e.preventDefault();
    showOrderHistory();
});

// About Us Modal (footer link)
document.getElementById('aboutUsFooterLink').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('aboutUsModal').style.display = 'flex';
});
function closeAboutUs() {
    document.getElementById('aboutUsModal').style.display = 'none';
}

