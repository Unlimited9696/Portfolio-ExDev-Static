// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            this.setAttribute('aria-expanded', this.classList.contains('active'));
        });
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Form validation and submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            if (!name) {
                showNotification('Please enter your name', 'error');
                return;
            }
            if (!email) {
                showNotification('Please enter your email', 'error');
                return;
            }
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            if (!message) {
                showNotification('Please enter your message', 'error');
                return;
            }
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            contactForm.reset();
        });
    }
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                notification.remove();
            });
        }
    }
    // Section fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    // Particles.js initialization (if available)
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#ffffff' },
                shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
                opacity: { value: 0.5, random: false, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
                size: { value: 3, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
                line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
                move: { enable: true, speed: 6, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 } }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
                modes: {
                    grab: { distance: 400, line_linked: { opacity: 1 } },
                    bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
                    repulse: { distance: 200, duration: 0.4 },
                    push: { particles_nb: 4 },
                    remove: { particles_nb: 2 }
                }
            },
            retina_detect: true
        });
    }

    // AI Chat Widget Functionality
    const chatWidget = document.getElementById('ai-chat-widget');
    const chatWindow = document.getElementById('chat-window');
    const chatToggle = document.getElementById('chat-toggle');
    const closeChat = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendMessage = document.getElementById('send-message');
    const quickReplies = document.querySelectorAll('.quick-reply');

    // Gemini API Configuration
    const GEMINI_API_KEY = 'AIzaSyAFOms0KBUlpNR_pa0P5ZQ3-j8rTnTkYDU';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    // Initialize chat widget
    if (chatWidget && chatWindow && chatToggle && closeChat && chatMessages && chatInput && sendMessage) {
        console.log('AI Chat Widget initialized successfully');

        // Toggle chat window
        chatToggle.addEventListener('click', () => {
            chatWindow.classList.add('active');
            chatInput.focus();
        });

        // Close chat window
        closeChat.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (!chatWidget.contains(e.target)) {
                chatWindow.classList.remove('active');
            }
        });

        // Send message on Enter key
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });

        // Send message on button click
        sendMessage.addEventListener('click', handleSendMessage);

        // Quick reply buttons
        quickReplies.forEach(button => {
            button.addEventListener('click', () => {
                const message = button.getAttribute('data-message');
                handleQuickReply(message);
            });
        });

        // Handle sending message
        async function handleSendMessage() {
            const message = chatInput.value.trim();
            if (!message) return;

            // Add user message
            addMessage(message, 'user');
            chatInput.value = '';
            sendMessage.disabled = true;

            // Show typing indicator
            showTypingIndicator();

            try {
                // Try Gemini API first
                const aiResponse = await getGeminiResponse(message);
                if (aiResponse) {
                    removeTypingIndicator();
                    addMessage(aiResponse, 'bot');
                } else {
                    // Fallback to local responses
                    const response = getLocalResponse(message);
                    removeTypingIndicator();
                    addMessage(response, 'bot');
                }
            } catch (error) {
                console.error('Error getting AI response:', error);
                // Fallback to local responses
                const response = getLocalResponse(message);
                removeTypingIndicator();
                addMessage(response, 'bot');
            }

            sendMessage.disabled = false;
        }

        // Handle quick reply
        async function handleQuickReply(message) {
            addMessage(message, 'user');
            showTypingIndicator();

            try {
                const aiResponse = await getGeminiResponse(message);
                if (aiResponse) {
                    removeTypingIndicator();
                    addMessage(aiResponse, 'bot');
                } else {
                    const response = getLocalResponse(message);
                    removeTypingIndicator();
                    addMessage(response, 'bot');
                }
            } catch (error) {
                console.error('Error getting AI response:', error);
                const response = getLocalResponse(message);
                removeTypingIndicator();
                addMessage(response, 'bot');
            }
        }

        // Gemini API Integration
        async function getGeminiResponse(message) {
            try {
                const prompt = `You are an AI assistant for ExDev Digital Solutions, a web development company in Pune, Maharashtra, India. 

Company Information:
- Founded by Abhay Jadhav and Nikhil Nagawade
- Specializes in web development, mobile apps, UI/UX design, and cloud solutions
- Pricing: Basic (₹7,999), Standard (₹14,999), Premium (₹29,999)
- Services: Web Development, Mobile Apps, UI/UX Design, Cloud Solutions, AI Integration
- Portfolio: Smart Bakery Management System, Law College Payment System, Price Tracking Platform
- Contact: exdev.contact@gmail.com, +91 7020560284, +91 9145226443

Please provide a helpful, professional response to the user's question. Keep responses concise but informative. If the user asks about pricing, services, portfolio, or contact information, provide accurate details. If they ask about technical topics, provide expert guidance. Always be friendly and professional.

User message: ${message}`;

                const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }],
                        safetySettings: [
                            {
                                category: 'HARM_CATEGORY_HARASSMENT',
                                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                            },
                            {
                                category: 'HARM_CATEGORY_HATE_SPEECH',
                                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                            },
                            {
                                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                            },
                            {
                                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                            }
                        ]
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                    return data.candidates[0].content.parts[0].text;
                } else {
                    console.log('No valid response from Gemini API');
                    return null;
                }
            } catch (error) {
                console.error('Error calling Gemini API:', error);
                return null;
            }
        }

        // Add message to chat
        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message`;
            
            const icon = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
            
            messageDiv.innerHTML = `
                <div class="message-content">
                    <i class="${icon}"></i>
                    <div class="message-text">
                        ${text.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `;
            
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Show typing indicator
        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot-message typing-indicator';
            typingDiv.innerHTML = `
                <div class="message-content">
                    <i class="fas fa-robot"></i>
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            `;
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Remove typing indicator
        function removeTypingIndicator() {
            const typingIndicator = chatMessages.querySelector('.typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }

        // Local response fallback
        function getLocalResponse(message) {
            const msg = message.toLowerCase();

            if (msg === 'pricing' || msg.includes('price') || msg.includes('cost')) {
                return `💰 Our Pricing Plans:\n\n` +
                    `🔹 Basic Plan: ₹7,999\n` +
                    `- Up to 5 static pages\n` +
                    `- Responsive design\n` +
                    `- 2-3 weeks timeline\n\n` +
                    `🔹 Standard Plan: ₹14,999\n` +
                    `- Up to 10-15 pages\n` +
                    `- Admin dashboard\n` +
                    `- Payment integration\n` +
                    `- 4-8 weeks timeline\n\n` +
                    `🔹 Premium Plan: ₹29,999\n` +
                    `- Unlimited pages\n` +
                    `- Custom modules\n` +
                    `- Advanced integrations\n` +
                    `- 8 weeks timeline\n\n` +
                    `💡 We also offer add-on services starting from ₹1,399.`;
            }

            if (msg === 'services' || msg.includes('service') || msg.includes('offer')) {
                return `🛠️ Our Services:\n\n` +
                    `🌐 Web Development\n` +
                    `- Custom websites\n` +
                    `- E-commerce solutions\n` +
                    `- Web applications\n\n` +
                    `📱 Mobile App Development\n` +
                    `- React Native apps\n` +
                    `- Native Android apps\n` +
                    `- Cross-platform solutions\n\n` +
                    `🎨 UI/UX Design\n` +
                    `- User interface design\n` +
                    `- User experience optimization\n` +
                    `- Brand identity design\n\n` +
                    `☁️ Cloud Solutions\n` +
                    `- AWS/Azure deployment\n` +
                    `- Server management\n` +
                    `- Database optimization\n\n` +
                    `🤖 AI Integration\n` +
                    `- Chatbot development\n` +
                    `- AI-powered features\n` +
                    `- Machine learning integration`;
            }

            if (msg === 'portfolio' || msg.includes('project') || msg.includes('work')) {
                return `📁 Our Portfolio Projects:\n\n` +
                    `🥖 Smart Bakery Management System\n` +
                    `- Inventory management\n` +
                    `- Order processing\n` +
                    `- Customer management\n\n` +
                    `🏛️ Law College Payment System\n` +
                    `- Fee collection\n` +
                    `- Student portal\n` +
                    `- Payment tracking\n\n` +
                    `📊 Price Tracking Platform\n` +
                    `- Real-time monitoring\n` +
                    `- Analytics dashboard\n` +
                    `- E-commerce integration\n\n` +
                    `💡 All projects are custom-built with modern technologies.`;
            }

            if (msg === 'contact' || msg.includes('reach') || msg.includes('email') || msg.includes('phone')) {
                return `📞 Contact Information:\n\n` +
                    `📧 Email: exdev.contact@gmail.com\n` +
                    `📱 Phone: +91 7020560284\n` +
                    `📱 Phone: +91 9145226443\n` +
                    `📍 Location: Pune, Maharashtra, India\n\n` +
                    `⏰ Available Hours:\n` +
                    `- Monday to Friday: 9 AM - 6 PM IST\n` +
                    `- Saturday: 10 AM - 4 PM IST\n\n` +
                    `💬 You can also:\n` +
                    `- Fill out our contact form\n` +
                    `- Request a custom quote\n` +
                    `- Schedule a consultation`;
            }

            if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
                return `Hello! 👋 I'm your ExDev AI assistant. How can I help you today?\n\n` +
                    `I can help with:\n` +
                    `- Project pricing and quotes\n` +
                    `- Service information\n` +
                    `- Portfolio showcase\n` +
                    `- Contact details\n` +
                    `- Technical consultation`;
            }

            if (msg.includes('founder') || msg.includes('team')) {
                return `Our founding team consists of two experienced developers:\n\n` +
                    `👨‍💻 Abhay Jadhav\n` +
                    `Full-Stack Developer with expertise in React, Node.js, Cloud Architecture\n\n` +
                    `👨‍💻 Nikhil Nagawade\n` +
                    `Full-Stack Developer specializing in UI/UX, React, and Backend Systems\n\n` +
                    `Both founders have 5+ years of experience in building scalable applications.`;
            }

            if (msg.includes('tech') || msg.includes('stack') || msg.includes('technology')) {
                return `We work with modern technology stack:\n\n` +
                    `🔹 Frontend: React, Next.js, Angular\n` +
                    `🔹 Backend: Node.js, Python, Java\n` +
                    `🔹 Database: MongoDB, MySQL, Firebase\n` +
                    `🔹 Mobile: React Native, Native Android\n` +
                    `🔹 Cloud: AWS, Azure, DigitalOcean\n\n` +
                    `What technology interests you?`;
            }

            // Default response
            return `How can I assist you with your project? I can help with:\n\n` +
                `💰 Project cost estimation\n` +
                `🏢 Industry-specific solutions\n` +
                `🛠️ Technical consultation\n` +
                `📦 Add-on features\n` +
                `🔒 Security solutions\n` +
                `🔧 Maintenance plans\n` +
                `☁️ Hosting solutions\n\n` +
                `Just let me know what you're interested in!`;
        }

    } else {
        console.error('Some chat widget elements are missing!');
    }
}); 