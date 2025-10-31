// Contact Form Email Handler using EmailJS
// Configuration: Replace these values with your EmailJS credentials
// Get them from: https://dashboard.emailjs.com/admin/integration

(function() {
    'use strict';

    // EmailJS Configuration
    // TODO: Replace these with your actual EmailJS credentials
    const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
    const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
    const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

    // Wait for EmailJS to load
    window.addEventListener('load', () => {
        // Initialize EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_PUBLIC_KEY);
        }
    });

    // Contact form handler
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Check if EmailJS is configured
            if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || 
                EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' || 
                EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
                formMessage.textContent = 'Email service not configured. Please set up EmailJS credentials.';
                formMessage.style.color = 'var(--white)';
                formMessage.style.opacity = '0.8';
                formMessage.style.display = 'block';
                return;
            }

            // Disable submit button and show loading state
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            // Hide previous message
            formMessage.style.display = 'none';

            try {
                // Prepare template parameters
                const templateParams = {
                    user_name: contactForm.user_name.value,
                    user_email: contactForm.user_email.value,
                    message: contactForm.message.value,
                    to_email: 'cortex@nexus.ox.ac.uk' // Recipient email
                };

                // Send email using EmailJS
                await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

                // Success message
                formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                formMessage.style.color = 'var(--white)';
                formMessage.style.display = 'block';

                // Reset form
                contactForm.reset();

            } catch (error) {
                console.error('EmailJS Error:', error);
                
                // Error message
                formMessage.textContent = 'Sorry, there was an error sending your message. Please try again or email us directly at cortex@nexus.ox.ac.uk';
                formMessage.style.color = 'var(--white)';
                formMessage.style.opacity = '0.8';
                formMessage.style.display = 'block';
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
})();

