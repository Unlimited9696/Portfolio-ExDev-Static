/* ==========================================================================
   RESPONSIVE JAVASCRIPT - Mobile Navigation & Interactions
   ExDev Digital Solutions - Fully Responsive Functionality
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // MOBILE NAVIGATION TOGGLE
    // ==========================================================================
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Create hamburger if it doesn't exist
    if (!hamburger && window.innerWidth <= 768) {
        createHamburgerMenu();
    }
    
    function createHamburgerMenu() {
        const navContainer = document.querySelector('.nav-container');
        const hamburgerHTML = `
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        navContainer.insertAdjacentHTML('beforeend', hamburgerHTML);
        
        // Re-query the hamburger after creation
        const newHamburger = document.querySelector('.hamburger');
        if (newHamburger) {
            setupMobileNavigation(newHamburger);
        }
    }
    
    function setupMobileNavigation(hamburgerElement) {
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    let touchStartX = 0;
    let touchEndX = 0;

    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }

    // Toggle menu
    hamburgerElement.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    // Handle touch gestures
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (swipeDistance > swipeThreshold && !navMenu.classList.contains('active')) {
            // Swipe right to open
            toggleMenu(true);
        } else if (swipeDistance < -swipeThreshold && navMenu.classList.contains('active')) {
            // Swipe left to close
            toggleMenu(false);
        }
    }

    function toggleMenu(force) {
        const shouldOpen = force !== undefined ? force : !navMenu.classList.contains('active');
        
        hamburgerElement.classList.toggle('active', shouldOpen);
        navMenu.classList.toggle('active', shouldOpen);
        document.body.classList.toggle('nav-open', shouldOpen);
        
        if (shouldOpen) {
            // Trap focus within menu when open
            trapFocus(navMenu);
        } else {
            // Restore focus when closed
            hamburgerElement.focus();
        }
    }

    // Close menu when clicking outside
    overlay.addEventListener('click', function() {
        toggleMenu(false);
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu(false);
        }
        });
    }
    
    // Setup mobile navigation if hamburger exists
    if (hamburger) {
        setupMobileNavigation(hamburger);
    }
    
    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger) {
                hamburger.classList.remove('active');
            }
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            document.body.classList.remove('nav-open');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        }
    });
    
    // ==========================================================================
    // RESPONSIVE NAVBAR SCROLL EFFECT
    // ==========================================================================
    
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (mobile optimization)
        if (window.innerWidth <= 768) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // ==========================================================================
    // RESPONSIVE IMAGE LOADING
    // ==========================================================================
    
    function setupResponsiveImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Initialize responsive images if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        setupResponsiveImages();
    }
    
    // ==========================================================================
    // RESPONSIVE FORM HANDLING
    // ==========================================================================
    
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Add focus/blur effects for better mobile UX
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Auto-resize textareas on mobile
            if (input.tagName === 'TEXTAREA') {
                input.addEventListener('input', function() {
                    this.style.height = 'auto';
                    this.style.height = this.scrollHeight + 'px';
                });
            }
        });
    });
    
    // ==========================================================================
    // RESPONSIVE VIEWPORT HEIGHT FIX (Mobile Safari)
    // ==========================================================================
    
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', function() {
        setTimeout(setViewportHeight, 100);
    });
    
    // ==========================================================================
    // RESPONSIVE TOUCH GESTURES
    // ==========================================================================
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    function handleSwipeGesture() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        // Swipe right to open menu (if closed)
        if (swipeDistance > swipeThreshold && !navMenu.classList.contains('active')) {
            if (hamburger && window.innerWidth <= 768) {
                hamburger.classList.add('active');
                navMenu.classList.add('active');
            }
        }
        
        // Swipe left to close menu (if open)
        if (swipeDistance < -swipeThreshold && navMenu.classList.contains('active')) {
            if (hamburger) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    }
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    });
    
    // ==========================================================================
    // RESPONSIVE WINDOW RESIZE HANDLER
    // ==========================================================================
    
    let resizeTimer;
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            
            // Reset mobile menu on desktop resize
            if (window.innerWidth > 768) {
                if (hamburger) {
                    hamburger.classList.remove('active');
                }
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
                document.body.classList.remove('nav-open');
                navbar.style.transform = 'translateY(0)';
            }
            
            // Recalculate responsive elements
            setViewportHeight();
            
        }, 250);
    });
    
    // ==========================================================================
    // RESPONSIVE SMOOTH SCROLLING
    // ==========================================================================
    
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ==========================================================================
    // RESPONSIVE PERFORMANCE OPTIMIZATIONS
    // ==========================================================================
    
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // ==========================================================================
    // RESPONSIVE ACCESSIBILITY ENHANCEMENTS
    // ==========================================================================
    
    // Keyboard navigation for mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            if (hamburger) {
                hamburger.classList.remove('active');
            }
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });
    
    // Focus management for mobile menu
    if (hamburger) {
        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // ==========================================================================
    // RESPONSIVE LOADING STATES
    // ==========================================================================
    
    // Add loading class to body until everything is ready
    document.body.classList.add('loading');
    
    window.addEventListener('load', function() {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
    });
    
    // ==========================================================================
    // RESPONSIVE ERROR HANDLING
    // ==========================================================================
    
    window.addEventListener('error', function(e) {
        console.warn('Responsive script error:', e.error);
    });
    
    // ==========================================================================
    // RESPONSIVE FEATURE DETECTION
    // ==========================================================================
    
    // Add classes based on device capabilities
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    } else {
        document.body.classList.add('no-touch');
    }
    
    // Detect if device supports hover
    if (window.matchMedia('(hover: hover)').matches) {
        document.body.classList.add('hover-support');
    } else {
        document.body.classList.add('no-hover');
    }
    
    // Detect connection speed (if supported)
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            document.body.classList.add('slow-connection');
        }
    }
    
    console.log('✅ Responsive JavaScript initialized successfully');
});

// ==========================================================================
// RESPONSIVE UTILITY FUNCTIONS (Global)
// ==========================================================================

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Get current breakpoint
function getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width < 480) return 'xs';
    if (width < 768) return 'sm';
    if (width < 1024) return 'md';
    if (width < 1200) return 'lg';
    return 'xl';
}

// Check if mobile device
function isMobile() {
    return window.innerWidth <= 768;
}

// Check if tablet device
function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

// Check if desktop device
function isDesktop() {
    return window.innerWidth > 1024;
}

// Focus trap utility
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    });

    firstFocusable.focus();
}