document.addEventListener('DOMContentLoaded', function() {

    // Language switching
    const languageSelect = document.getElementById('language-select');

    function updateContent(lang) {
        document.documentElement.lang = lang; // Set the lang attribute on the html tag
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            if (languages[lang] && languages[lang][key]) {
                if (key === 'contactEmail') {
                    element.href = `mailto:${languages[lang][key]}`;
                    element.innerHTML = languages[lang][key];
                } else if (key === 'contactPhone') {
                    element.href = `tel:${languages[lang][key]}`;
                    element.innerHTML = languages[lang][key];
                } else {
                    element.innerHTML = languages[lang][key];
                }
            }
        });
    }

    // Set initial language based on stored preference or default to German
    const initialLanguage = localStorage.getItem('selectedLanguage') || 'de';
    languageSelect.value = initialLanguage; // Set the dropdown to the stored language
    updateContent(initialLanguage); // Apply initial language immediately

    languageSelect.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        localStorage.setItem('selectedLanguage', selectedLanguage); // Save language preference
        updateContent(selectedLanguage); // Apply new language
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.main-nav a, .cta-button');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // If the link is to another page, let the browser handle it
            if (!href.startsWith('#')) {
                return;
            }

            e.preventDefault();
            const targetId = href;
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for sticky header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form validation
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('form-feedback');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();

        if (!firstName || !lastName || !email) {
            formFeedback.textContent = 'Please fill in all required fields.';
            formFeedback.style.color = 'red';
            return;
        }

        if (!validateEmail(email)) {
            formFeedback.textContent = 'Please enter a valid email address.';
            formFeedback.style.color = 'red';
            return;
        }

        if (phone && !validatePhone(phone)) {
            formFeedback.textContent = 'Please enter a valid phone number.';
            formFeedback.style.color = 'red';
            return;
        }

        // Send data to the backend
        fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, email, phone })
        })
        .then(response => response.text())
        .then(data => {
            formFeedback.textContent = data;
            formFeedback.style.color = 'green';
            contactForm.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            formFeedback.textContent = 'An error occurred. Please try again later.';
            formFeedback.style.color = 'red';
        });
    });

    function validateEmail(email) {
        const re = /^(([^<>()[\\]\\.,;:\s@"]+(\.[^<>()[\\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePhone(phone) {
        const re = /\+?[0-9\s-]{7,}/;
        return re.test(phone);
    }

    // Fade-in animations on scroll
    const sections = document.querySelectorAll('.content-section');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });

    // Dynamic Hero Background Image
    const heroBackground = document.querySelector('.hero-background');
    const images = [
        'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop', // IT Consulting
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop', // Cybersecurity
        'https://images.unsplash.com/photo-1507679799977-c937123afe50?q=80&w=2070&auto=format&fit=crop', // Coaching
        'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop' // Multimedia
    ];

    const randomIndex = Math.floor(Math.random() * images.length);
    heroBackground.style.backgroundImage = `url(${images[randomIndex]})`;
});