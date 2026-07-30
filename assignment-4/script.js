// ==========================================
// 1. INITIALIZATION & SETUP
// ==========================================

// Initialize EmailJS. 
// NOTE: I am keeping the key you had before, but for real emails to send,
// you MUST replace this string with your actual Public Key from your EmailJS Account!
// You can find this in Account -> API Keys.
emailjs.init("wPJLGMlu4lOZCvBxN"); 

// State variable to hold our cart items
// Using an array makes it easy to push and remove items!
let cart = [];

// Grab elements from the page so we don't have to keep searching for them
const cartBody = document.getElementById('cart-body');
const totalAmountEl = document.getElementById('total-amount');
const bookForm = document.getElementById('book-form');
const bookingMsg = document.getElementById('booking-msg');
const bookBtn = document.getElementById('book-btn');
const servicesList = document.getElementById('services-list');
const newsletterForm = document.getElementById('newsletter-form');

// ==========================================
// 2. USER EXPERIENCE (Smooth Scroll)
// ==========================================

// When someone clicks "Book Now" at the top, scroll them down nicely
if (bookBtn) {
    bookBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const section = document.getElementById('services-booking-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ==========================================
// 3. CART LOGIC
// ==========================================

// This function updates the HTML table with our current cart data
function renderCart() {
    // Clear out what was there before
    cartBody.innerHTML = '';
    let total = 0;

    // Loop through everything in our cart array
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        
        // Create a new row for the table
        let tr = document.createElement('tr');
        
        // Build the HTML for the row. Adding (i + 1) gives us a nice 1, 2, 3 sequence
        tr.innerHTML = '<td>' + (i + 1) + '</td>' +
                       '<td>' + item.name + '</td>' +
                       '<td>₹' + item.price.toFixed(2) + '</td>';
                       
        // Attach it to the table body
        cartBody.appendChild(tr);
        
        // Keep a running total of the cost
        total += item.price;
    }

    // Finally, update the total text on screen
    totalAmountEl.textContent = '₹' + total.toFixed(2);
}

// This runs when a user clicks anywhere in the services list
function handleServiceClick(e) {
    // Event delegation: We only care if they clicked a button with class "action-btn"
    if (!e.target.classList.contains('action-btn')) return;

    let btn = e.target;
    // Pull the data we attached to the HTML element
    let id = btn.getAttribute('data-id');
    let name = btn.getAttribute('data-name');
    let price = parseFloat(btn.getAttribute('data-price'));

    // Check if we already have this item in our cart
    let itemIndex = cart.findIndex(function(item) {
        return item.id === id;
    });

    if (itemIndex > -1) {
        // It's already there! So this must be a click to remove it.
        cart.splice(itemIndex, 1);
        
        // Change the button back to the "Add" state
        btn.classList.remove('remove-btn');
        btn.classList.add('add-btn');
        btn.textContent = 'Add Item ⊕';
    } else {
        // It's not there, so let's add it.
        cart.push({ id: id, name: name, price: price });
        
        // Change the button to the "Remove" state
        btn.classList.remove('add-btn');
        btn.classList.add('remove-btn');
        btn.textContent = 'Remove Item ⊖';
    }

    // Re-draw the cart!
    renderCart();
}

// Listen for clicks on the services list
if (servicesList) {
    servicesList.addEventListener('click', handleServiceClick);
}

// ==========================================
// 4. FORM VALIDATION HELPERS
// ==========================================

function isValidName(name) {
    // Names should be at least a little bit long (no 1-letter names usually)
    return name.trim().length >= 3;
}

function isValidEmail(email) {
    // A standard pattern check for something@something.something
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    // IMPROVED VALIDATION:
    // First, strip out spaces, dashes, or parentheses if the user typed them
    let numbersOnly = phone.replace(/\D/g, '');
    
    // In India, numbers are 10 digits and start with 6, 7, 8, or 9.
    // This regex checks exactly that!
    return /^[6-9]\d{9}$/.test(numbersOnly);
}

// ==========================================
// 5. BOOKING SUBMISSION (EmailJS)
// ==========================================

if (bookForm) {
    bookForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop the page from reloading!
        
        // Grab what the user typed
        let name = document.getElementById('b-name').value;
        let email = document.getElementById('b-email').value;
        let phone = document.getElementById('b-phone').value;

        // --- VALIDATION ---
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
            alert("Please enter a valid 10-digit Indian phone number (starting with 6-9).");
            return;
        }
        // ------------------

        // Build the data object exactly as your EmailJS template expects it
        let params = {
            name: name,
            email: email,
            phone: phone,
            total_amount: totalAmountEl.textContent,
            // (Optional) We could also send a comma-separated list of items they booked
            items: cart.map(function(item) { return item.name; }).join(', ')
        };

        // Give the user some visual feedback that we are processing their request
        let submitBtn = bookForm.querySelector('button');
        let originalText = submitBtn.textContent;
        submitBtn.textContent = 'Booking...';
        submitBtn.disabled = true;

        // NOTE: Replace 'service_6f4zygd' and 'template_vbgax32' with your ACTUAL Service ID and Template ID
        // from your EmailJS dashboard. If you use placeholders, this will fail.
        emailjs.send('service_6f4zygd', 'template_vbgax32', params)
            .then(function(response) {
                console.log('Email sent successfully!', response.status, response.text);
                
                // Show our nice UI thank you message instead of an ugly alert
                if (bookingMsg) {
                    bookingMsg.style.display = 'block';
                    // Hide it automatically after 5 seconds
                    setTimeout(function() {
                        bookingMsg.style.display = 'none';
                    }, 5000);
                }

                // Clean up: Reset form, empty cart, re-render
                bookForm.reset();
                cart = [];
                renderCart();
                
                // Set all the Add buttons back to normal
                let btns = document.querySelectorAll('.action-btn');
                for (let i = 0; i < btns.length; i++) {
                    btns[i].classList.remove('remove-btn');
                    btns[i].classList.add('add-btn');
                    btns[i].textContent = 'Add Item ⊕';
                }
            })
            .catch(function(err) {
                console.error('Email failed to send...', err);
                alert('Oops! Something went wrong. Please check your EmailJS credentials (Service ID, Template ID, Public Key).');
            })
            .finally(function() {
                // Whether it worked or failed, put the button back to normal
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
}

// ==========================================
// 6. NEWSLETTER
// ==========================================

if (newsletterForm) {
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
}
