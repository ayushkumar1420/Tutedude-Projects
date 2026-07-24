// Initialize EmailJS (Replace 'YOUR_PUBLIC_KEY' with actual public key)
(function() {
    emailjs.init("service_6f4zygd");
})();

document.addEventListener('DOMContentLoaded', function() {
    const bookBtn = document.getElementById('book-btn');
    const bookingMsg = document.getElementById('booking-msg');

    if (bookBtn) {
        bookBtn.addEventListener('click', function() {
            // Display the success message
            bookingMsg.style.display = 'block';
            
            // Example of how to send email using EmailJS
            // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with actual IDs
            const templateParams = {
                message: 'Thank you For Booking the Service We will get back to you soon!'
            };

            // Uncomment the following lines when you have valid EmailJS credentials
            emailjs.send('service_6f4zygd', 'template_gjiyl7o', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                }, function(error) {
                    console.log('FAILED...', error);
                });
            
            console.log("Email confirmation would be sent here via email.js");
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
