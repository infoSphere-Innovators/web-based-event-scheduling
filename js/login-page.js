// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  get
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4YDw8dhp1qsJ7BhlNUSNHq3BxYzg6GDI",
  authDomain: "web-based-event-scheduling.firebaseapp.com",
  projectId: "web-based-event-scheduling",
  databaseURL: "https://web-based-event-scheduling-default-rtdb.firebaseio.com", // <- required for Realtime DB
  storageBucket: "web-based-event-scheduling.appspot.com",
  messagingSenderId: "925435406930",
  appId: "1:925435406930:web:48c759977c266a2cedcd8b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Handle form submission
document.getElementById("signInForm").addEventListener("submit", async function (e) {
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

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const uid = user.uid; // ✅ Add this line

    // Fetch member data from Realtime Database
    const memberRef = ref(db, `members/${uid}`);
    const snapshot = await get(memberRef);

    if (!snapshot.exists()) {
        Swal.fire({
        icon: 'warning',
        title: 'Profile Not Found',
        text: 'You are authenticated, but no member profile exists. Contact admin.'
        });
        return;
    }

    const memberData = snapshot.val();

    if (!memberData.Approved) {
        Swal.fire({
        icon: 'info',
        title: 'Account Not Approved',
        text: 'Your account is not yet approved. Would you like to continue as a guest?',
        showCancelButton: true,
        confirmButtonText: 'Continue as Guest',
        cancelButtonText: 'Close'
        }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "/html/user-dashboard.html";
        }
        });
        return;
    }

    // Approved member
    Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Redirecting to your dashboard...',
        showConfirmButton: false,
        timer: 2000
    }).then(() => {
        window.location.href = "/html/profile-details.html";
    });

    } catch (error) {
    let errorMessage = "Login failed. Please try again.";

    if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Wrong email or password.";
    } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
    }

    Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMessage
    });
    }


});
