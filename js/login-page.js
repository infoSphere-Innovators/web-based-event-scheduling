document.getElementById('signInForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Here you would typically handle the sign-in logic
    // For demonstration purposes, we'll just log the values
    console.log('Username:', username);
    console.log('Password:', password);
    
    // Clear the form
    this.reset();
});

// Add focus effects to input fields
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
});