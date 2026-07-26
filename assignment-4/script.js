// Initialize EmailJS
emailjs.init("wPJLGMlu4lOZCvBxN");

// State
let cart = [];

// DOM Elements
const cartBody = document.getElementById('cart-body');
const totalAmountEl = document.getElementById('total-amount');
const bookForm = document.getElementById('book-form');
const newsletterForm = document.getElementById('newsletter-form');

// Smooth scrolling
document.getElementById('book-btn').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('services-booking-section').scrollIntoView({ behavior: 'smooth' });
});

// Cart functionality
function renderCart() {
    cartBody.innerHTML = '';
    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let tr = document.createElement('tr');
        tr.innerHTML = '<td>' + (i + 1) + '</td>' +
                       '<td>' + item.name + '</td>' +
                       '<td>₹' + item.price.toFixed(2) + '</td>';
        cartBody.appendChild(tr);
        total += item.price;
    }

    totalAmountEl.textContent = '₹' + total.toFixed(2);
}

function handleServiceClick(e) {
    if (!e.target.classList.contains('action-btn')) return;

    let btn = e.target;
    let id = btn.getAttribute('data-id');
    let name = btn.getAttribute('data-name');
    let price = parseFloat(btn.getAttribute('data-price'));

    let itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        cart.splice(itemIndex, 1);
        btn.classList.remove('remove-btn');
        btn.classList.add('add-btn');
        btn.textContent = 'Add Item ⊕';
    } else {
        cart.push({ id: id, name: name, price: price });
        btn.classList.remove('add-btn');
        btn.classList.add('remove-btn');
        btn.textContent = 'Remove Item ⊖';
    }

    renderCart();
}

document.getElementById('services-list').addEventListener('click', handleServiceClick);

// Validation helpers
function isValidName(name) {
    return name.trim().length >= 3;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^\d{10}$/.test(phone.replace(/\D/g, ''));
}

// Booking form
bookForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let name = document.getElementById('b-name').value;
    let email = document.getElementById('b-email').value;
    let phone = document.getElementById('b-phone').value;

    if (cart.length === 0) {
        alert("Please add some services to your cart first.");
        return;
    }

    if (!isValidName(name)) {
        alert("Please enter a valid name (at least 3 characters).");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!isValidPhone(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    let params = {
        name: name,
        email: email,
        phone: phone,
        total_amount: totalAmountEl.textContent
    };

    let submitBtn = bookForm.querySelector('button');
    submitBtn.textContent = 'Booking...';
    submitBtn.disabled = true;

    emailjs.send('service_6f4zygd', 'template_vbgax32', params)
        .then(function() {
            alert('Booking successful! Check your email.');
            bookForm.reset();
            cart = [];
            renderCart();
            
            // Reset buttons
            let btns = document.querySelectorAll('.action-btn');
            for (let i = 0; i < btns.length; i++) {
                btns[i].classList.remove('remove-btn');
                btns[i].classList.add('add-btn');
                btns[i].textContent = 'Add Item ⊕';
            }
        })
        .catch(function(err) {
            alert('Something went wrong. Please try again.');
            console.error(err);
        })
        .finally(function() {
            submitBtn.textContent = 'Book now';
            submitBtn.disabled = false;
        });
});

// Newsletter
newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    if (isValidName(name) && isValidEmail(email)) {
        alert("Thanks for subscribing, " + name + "!");
        newsletterForm.reset();
    } else {
        alert("Please enter a valid name and email.");
    }
});
