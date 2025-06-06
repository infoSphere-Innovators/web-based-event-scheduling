import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase, ref, set, get, child, push } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC4YDw8dhp1qsJ7BhlNUSNHq3BxYzg6GDI",
  authDomain: "web-based-event-scheduling.firebaseapp.com",
  projectId: "web-based-event-scheduling",
  storageBucket: "web-based-event-scheduling.firebasestorage.app",
  messagingSenderId: "925435406930",
  appId: "1:925435406930:web:48c759977c266a2cedcd8b"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.getElementById("submit").addEventListener('click', async function (e) {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const midName = document.getElementById("midName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const userName = document.getElementById("userName").value.trim();
  const address = document.getElementById("address").value.trim();
  const transparochial = document.getElementById("trasparochial").value;
  const position = document.getElementById("position").value;
  const zone = document.getElementById("zone").value;
  const chapel = document.getElementById("chapel").value;
  const password = document.getElementById("password").value;

  if (!firstName || !midName || !lastName || !userName || !address || !transparochial || !position || !zone || !chapel || !password) {
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete Fields',
      text: 'Please fill in all fields before submitting.',
      confirmButtonColor: '#9D62F5'
    });
    return;
  }

  try {
    const newRef = push(ref(db, 'members')); // auto-incremented UID
    const uid = newRef.key;

    const data = {
      uid,
      firstname: firstName,
      middlename: midName,
      lastname: lastName,
      username: userName,
      address,
      transparochial,
      position,
      zone,
      chapel,
      password // NOTE: for demo only; in real systems, hash this!
    };

    await set(newRef, data);

    // Store UID in localStorage for QR/Profile page
    localStorage.setItem("currentUID", uid);

    Swal.fire({
      icon: 'success',
      title: 'Sign Up Successful!',
      text: 'Redirecting to profile...',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      window.location.href = "tryqr.html";
    });

  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Save Failed',
      text: 'Could not save data. Try again.',
    });
  }
});
