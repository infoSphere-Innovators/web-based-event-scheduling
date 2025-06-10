// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC4YDw8dhp1qsJ7BhlNUSNHq3BxYzg6GDI",
    authDomain: "web-based-event-scheduling.firebaseapp.com",
    projectId: "web-based-event-scheduling",
    storageBucket: "web-based-event-scheduling.appspot.com",
    messagingSenderId: "925435406930",
    appId: "1:925435406930:web:48c759977c266a2cedcd8b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Handle form submission
document.getElementById("signInForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        Swal.fire({
            icon: 'warning',
            title: 'Missing Fields',
            text: 'Please enter both email and password.'
        });
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Login successful
            Swal.fire({
                icon: 'success',
                title: 'Login Successful!',
                text: 'Redirecting to your dashboard...',
                showConfirmButton: false,
                timer: 2000
            }).then(() => {
                window.location.href = "/html/user-dashboard.html";
            });
        })
        .catch((error) => {
            let errorMessage = "Login failed. Please try again.";

            if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                errorMessage = "Error: Wrong email or password. This user may not be registered.";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "Invalid email format.";
            }

            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: errorMessage
            });
        });
});
