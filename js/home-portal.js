document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqBox = question.parentElement;
        faqBox.classList.toggle('active');
        
        // Close other open FAQs
        document.querySelectorAll('.faq-box').forEach(box => {
            if (box !== faqBox) {
                box.classList.remove('active');
            }
        });
    });
});