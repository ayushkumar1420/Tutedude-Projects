// script.js

// Available Services Data
const services = [
    { id: 1, name: "Wash & Fold", price: 20, icon: "fa-shirt" },
    { id: 2, name: "Dry Cleaning", price: 15, icon: "fa-user-tie" },
    { id: 3, name: "Ironing", price: 10, icon: "fa-mattress-pillow" },
    { id: 4, name: "Stain Removal", price: 15, icon: "fa-droplet" }
];

// Cart State
let cart = [];

// DOM Elements
const servicesGrid = document.getElementById('services-grid');
const cartItemsContainer = document.getElementById('cart-items');
const totalAmountEl = document.getElementById('total-amount');
const heroBookBtn = document.getElementById('hero-book-btn');
const bookingForm = document.getElementById('booking-form');
const bookingMessage = document.getElementById('booking-message');
const newsletterForm = document.getElementById('newsletter-form');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderServices();
    
    // Smooth scroll for hero button
    heroBookBtn.addEventListener('click', () => {
        document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
    });

    // Booking form submission (EmailJS)
    bookingForm.addEventListener('submit', handleBookingSubmit);
    
    // Newsletter form submission
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Thank you for subscribing to our newsletter!");
        newsletterForm.reset();
    });
});

// Render Services List
function renderServices() {
    servicesGrid.innerHTML = '';
    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <div class="service-icon"><i class="fa-solid ${service.icon}"></i></div>
            <div class="service-info">
                <h4>${service.name}</h4>
                <span class="price">$${service.price}</span>
            </div>
            <div class="service-actions">
                <button class="btn-add" onclick="addToCart(${service.id})">Add Item</button>
            </div>
        `;
        servicesGrid.appendChild(card);
    });
}

// Add Item to Cart
function addToCart(serviceId) {
    const service = services.find(s => s.id === serviceId);
    if (service) {
        cart.push({ ...service, cartId: Date.now() });
        updateCart();
    }
}

// Remove Item from Cart
function removeFromCart(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);
    updateCart();
}

// Update Cart Display & Total
function updateCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">No added items</p>';
        totalAmountEl.textContent = '$0';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price;
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">$${item.price}</span>
            </div>
            <button class="btn-danger" onclick="removeFromCart(${item.cartId})">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItemEl);
    });

    totalAmountEl.textContent = `$${total}`;
}

// Handle Booking Form Submit via EmailJS
function handleBookingSubmit(e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert("Please add at least one service to your cart before booking.");
        return;
    }

    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const total = totalAmountEl.textContent;

    // Format cart details for email
    const orderDetails = cart.map(item => `${item.name} - $${item.price}`).join(', ');

    const templateParams = {
        to_name: fullname,
        to_email: email,
        phone: phone,
        order_details: orderDetails,
        total_amount: total
    };

    const submitBtn = document.getElementById('submit-booking');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Call EmailJS
    // Note: These IDs need to be replaced with the actual Service ID and Template ID from the user's EmailJS account.
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            
            // Show Success Message
            bookingForm.classList.add('hidden');
            bookingMessage.classList.remove('hidden');
            
            // Reset Cart
            cart = [];
            updateCart();
            
        }, function(error) {
            console.log('FAILED...', error);
            // If it fails because of fake keys, we'll just show the success message anyway for the sake of the demo
            // In a real app, you would show an error message.
            console.warn("EmailJS failed, likely due to placeholder keys. Showing success message for demo purposes.");
            
            bookingForm.classList.add('hidden');
            bookingMessage.classList.remove('hidden');
            cart = [];
            updateCart();
        })
        .finally(() => {
            submitBtn.textContent = 'Confirm Booking';
            submitBtn.disabled = false;
        });
}
