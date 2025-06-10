document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(`${btn.dataset.tab}-tab`).classList.add('active');
        });
    });

    // Enhanced FAQ functionality
    const faqBoxes = document.querySelectorAll('.faq-box');
    
    faqBoxes.forEach(box => {
        const question = box.querySelector('.faq-question');
        const answer = box.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = box.classList.contains('active');
            
            // Close all other FAQs
            faqBoxes.forEach(otherBox => {
                if (otherBox !== box) {
                    otherBox.classList.remove('active');
                    const otherAnswer = otherBox.querySelector('.faq-answer');
                    otherAnswer.style.height = '0';
                }
            });
            
            // Toggle current FAQ
            box.classList.toggle('active');
            
            // Animate height
            if (!isActive) {
                answer.style.height = answer.scrollHeight + 'px';
            } else {
                answer.style.height = '0';
            }
        });
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all major sections
    document.querySelectorAll('.hero-section, .info-tabs, .faq-section, .register-section').forEach(section => {
        observer.observe(section);
    });
});