/* ========================================
   ECE Portfolio - JavaScript
   Interactivity, Animations, and Form Validation
   ======================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initProjectFilter();
    initSkillBars();
    initSmoothScroll();
    initContactForm();
    initActiveNavLink();
});

/* === Navbar Scroll Effect === */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        // Add scrolled class when scrolled past 100px
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/* === Mobile Menu Toggle === */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navLinksAnchors = navLinks.querySelectorAll('a');

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinksAnchors.forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* === Scroll Reveal Animation === */
function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // If this is a skill category, trigger skill bar animation
                if (entry.target.classList.contains('skill-category')) {
                    animateSkillBars(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all elements with reveal classes
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    revealElements.forEach(el => observer.observe(el));
}

/* === Project Filter === */
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    card.style.display = 'block';

                    // Trigger reflow
                    card.offsetHeight;

                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';

                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Add transition styles to project cards
    projectCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
}

/* === Skill Bars Animation === */
function initSkillBars() {
    // Initial state - bars at 0 width
    const allBars = document.querySelectorAll('.skill-progress');
    allBars.forEach(bar => {
        bar.style.width = '0';
    });
}

function animateSkillBars(container) {
    const bars = container.querySelectorAll('.skill-progress');

    bars.forEach((bar, index) => {
        const targetWidth = bar.getAttribute('data-width');

        setTimeout(() => {
            bar.style.width = targetWidth + '%';
        }, index * 150);
    });
}

/* === Smooth Scroll === */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* === Active Nav Link on Scroll === */
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', function () {
        let current = '';
        const navHeight = document.getElementById('navbar').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;

            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

/* === Contact Form Validation === */
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    form.addEventListener('submit', function (e) {
        let isValid = true;
        const formGroups = form.querySelectorAll('.form-group');

        // Remove previous errors
        formGroups.forEach(group => {
            group.classList.remove('error');
        });

        // Validate each field
        const name = form.querySelector('#name');
        const email = form.querySelector('#email');
        const subject = form.querySelector('#form_subject');
        const message = form.querySelector('#message');

        if (!name.value.trim()) {
            name.parentElement.classList.add('error');
            isValid = false;
        }

        if (!isValidEmail(email.value)) {
            email.parentElement.classList.add('error');
            isValid = false;
        }

        if (!subject.value.trim()) {
            subject.parentElement.classList.add('error');
            isValid = false;
        }

        if (!message.value.trim()) {
            message.parentElement.classList.add('error');
            isValid = false;
        }

        if (!isValid) {
            e.preventDefault();
            showFormMessage('error', 'Please fill in all required fields correctly.');
        }
        // If valid, form will submit normally to Web3Forms
    });

    // Real-time validation on blur
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });

        input.addEventListener('input', function () {
            if (this.parentElement.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const parent = field.parentElement;
    let isValid = true;

    if (field.type === 'email') {
        isValid = isValidEmail(field.value);
    } else {
        isValid = field.value.trim() !== '';
    }

    if (isValid) {
        parent.classList.remove('error');
    } else {
        parent.classList.add('error');
    }

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormMessage(type, message) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    // Style the message
    messageEl.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-weight: 500;
        animation: fadeInUp 0.3s ease;
        ${type === 'success'
            ? 'background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7;'
            : 'background: #ffebee; color: #c62828; border: 1px solid #ef9a9a;'}
    `;

    // Insert before the form
    const form = document.getElementById('contactForm');
    form.parentElement.insertBefore(messageEl, form);

    // Remove message after 5 seconds
    setTimeout(() => {
        messageEl.style.opacity = '0';
        messageEl.style.transform = 'translateY(-10px)';
        messageEl.style.transition = 'all 0.3s ease';
        setTimeout(() => messageEl.remove(), 300);
    }, 5000);
}

/* === Typing Effect for Hero (Optional Enhancement) === */
function initTypingEffect() {
    const roles = ['IoT Developer', 'Embedded Systems Engineer', 'ECE Student'];
    const roleElement = document.querySelector('.hero-content .role');

    if (!roleElement) return;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            roleElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            roleElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing new word
        }

        setTimeout(type, typingSpeed);
    }

    // Uncomment to enable typing effect
    // type();
}

/* === Parallax Effect for Hero (Optional Enhancement) === */
function initParallax() {
    const hero = document.querySelector('.hero');

    if (!hero) return;

    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;

        if (scrolled < heroHeight) {
            const parallaxElements = hero.querySelectorAll('.circuit-pattern');
            parallaxElements.forEach(el => {
                el.style.transform = `translateY(${scrolled * 0.3}px)`;
            });
        }
    });
}

/* === Counter Animation for Stats (If needed) === */
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }

    updateCounter();
}

/* === Newsletter Form (Optional) === */
document.addEventListener('DOMContentLoaded', function () {
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const input = this.querySelector('input');

            if (isValidEmail(input.value)) {
                input.value = '';
                input.placeholder = 'Thanks for subscribing!';
                setTimeout(() => {
                    input.placeholder = 'Enter your email';
                }, 3000);
            }
        });
    }
});

/* === Preloader (Optional) === */
function initPreloader() {
    const preloader = document.querySelector('.preloader');

    if (preloader) {
        window.addEventListener('load', function () {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }
}

/* === Back to Top Button (Optional Enhancement) === */
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');

    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #3f51b5, #5c6bc0);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 15px rgba(63, 81, 181, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
    `;

    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });

    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    backToTopBtn.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.1)';
    });

    backToTopBtn.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
    });
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', initBackToTop);
