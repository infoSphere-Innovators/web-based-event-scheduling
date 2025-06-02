
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
  import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyC4YDw8dhp1qsJ7BhlNUSNHq3BxYzg6GDI",
    authDomain: "web-based-event-scheduling.firebaseapp.com",
    projectId: "web-based-event-scheduling",
    storageBucket: "web-based-event-scheduling.firebasestorage.app",
    messagingSenderId: "925435406930",
    appId: "1:925435406930:web:48c759977c266a2cedcd8b"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const db = getDatabase(app);

  document.getElementById("submit").addEventListener('click', function(e){
    e.preventDefault();
    set(ref(db, 'member/' + document.getElementById("position").value),
    {
        firstname: document.getElementById("firstName").value,
        lastname: document.getElementById("lastName").value,
        position: document.getElementById("position").value,
        zone: document.getElementById("zone").value,
        chapel: document.getElementById("chapel").value
    });
        alert("Login Successfull    !");
  })
