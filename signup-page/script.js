
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

  document.getElementById("submit").addEventListener('click', function (e) {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const position = document.getElementById("position").value;
  const zone = document.getElementById("zone").value;
  const chapel = document.getElementById("chapel").value;

  if (!firstName || !lastName || !position || !zone || !chapel) {
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete Fields',
      text: 'Please fill in all fields before submitting.',
      confirmButtonColor: '#9D62F5'
    });
    return;
  }

  set(ref(db, 'member/' + firstName), {
    firstname: firstName,
    lastname: lastName,
    position: position,
    zone: zone,
    chapel: chapel
  })
  .then(() => {
    Swal.fire({
      icon: 'success',
      title: 'Login Successful!',
      text: 'Your information has been saved successfully.',
      showConfirmButton: false,
      timer: 2000,
      backdrop: true,
      customClass: {
        popup: 'rounded-xl shadow-lg'
      }
    }).then(() => {
      document.querySelector("form").reset(); // reset the form
    });
  })
  .catch((error) => {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Failed to Save',
      text: 'An error occurred while saving your data. Please try again.',
      confirmButtonColor: '#d33'
    });
  });
});
