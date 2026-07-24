// Initialize EmailJS
(function() {
    emailjs.init("wPJLGMlu4lOZCvBxN");
})();

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling to services section
    const bookBtn = document.getElementById('book-btn');
    if (bookBtn) {
        bookBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const section = document.getElementById('services-booking-section');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Cart Logic
    const cart = [];
    const cartBody = document.getElementById('cart-body');
    const totalAmountEl = document.getElementById('total-amount');
    const actionBtns = document.querySelectorAll('.action-btn');
    
    function updateCartUI() {
        // Clear cart body
        cartBody.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>₹${item.price.toFixed(2)}</td>
            `;
            cartBody.appendChild(tr);
            total += item.price;
        });

        totalAmountEl.textContent = `₹${total.toFixed(2)}`;
    }

    actionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));

            // Check if item is already in cart
            const index = cart.findIndex(item => item.id === id);

            if (index > -1) {
                // Remove item
                cart.splice(index, 1);
                this.classList.remove('remove-btn');
                this.classList.add('add-btn');
                this.textContent = 'Add Item ⊕';
            } else {
                // Add item
                cart.push({ id, name, price });
                this.classList.remove('add-btn');
                this.classList.add('remove-btn');
                this.textContent = 'Remove Item ⊖';
            }

            updateCartUI();
        });
    });

    // Book Form Submission
    const bookForm = document.getElementById('book-form');
    if (bookForm) {
        bookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('b-name').value;
            const email = document.getElementById('b-email').value;
            const phone = document.getElementById('b-phone').value;

            if (cart.length === 0) {
                alert("Please add at least one service to your cart before booking.");
                return;
            }

            // EmailJS params
            const templateParams = {
                to_name: name,
                to_email: email,
                phone: phone,
                message: 'Thank you for booking the service. We will get back to you soon!',
                total_amount: totalAmountEl.textContent
            };

            emailjs.send('service_6f4zygd', 'template_vbgax32', templateParams)
                .then(function(response) {
                    alert('Booking successful! Confirmation email sent.');
                    bookForm.reset();
                    // Reset cart
                    cart.length = 0;
                    updateCartUI();
                    actionBtns.forEach(btn => {
                        btn.classList.remove('remove-btn');
                        btn.classList.add('add-btn');
                        btn.textContent = 'Add Item ⊕';
                    });
                }, function(error) {
                    alert('Failed to send booking email. Please try again later.');
                    console.log('FAILED...', error);
                });
        });
    }

    // Newsletter form submission handler
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            
            alert(`Thank you for subscribing, ${name}!`);
            newsletterForm.reset();
        });
    }
});
