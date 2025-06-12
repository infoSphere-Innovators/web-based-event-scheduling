import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC4YDw8dhp1qsJ7BhlNUSNHq3BxYzg6GDI",
  authDomain: "web-based-event-scheduling.firebaseapp.com",
  projectId: "web-based-event-scheduling",
  storageBucket: "web-based-event-scheduling.appspot.com",
  messagingSenderId: "925435406930",
  appId: "1:925435406930:web:48c759977c266a2cedcd8b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Auto-set zone & chapel based on transparochial
document.getElementById("trasparochial").addEventListener("change", function () {
  const transparochial = this.value;
  const zone = document.getElementById("zone");
  const chapel = document.getElementById("chapel");

  if (transparochial === "Yes") {
    zone.value = "No Zone";
    chapel.value = "No Chapel";
    zone.disabled = true;
    chapel.disabled = true;
  } else {
    zone.disabled = false;
    chapel.disabled = false;
    zone.value = "";
    chapel.value = "";
  }
});

document.getElementById("submit").addEventListener('click', async function (e) {
  e.preventDefault();

  const firstName = document.getElementById("firstname").value.trim();
  const midName = document.getElementById("middlename").value.trim();
  const lastName = document.getElementById("lastname").value.trim();
  const userName = document.getElementById("username").value.trim();
  const address = document.getElementById("address").value.trim();
  const transparochial = document.getElementById("trasparochial").value;
  const position = document.getElementById("position").value;
  const zone = document.getElementById("zone").value;
  const chapel = document.getElementById("chapel").value;
  const password = document.getElementById("password").value;
  const contact = document.getElementById("contact").value.trim();
  const email = document.getElementById("email").value.trim();
  const ministry = document.getElementById("ministry").value;

  if (!firstName || !midName || !lastName || !userName || !address || !transparochial || !position || !zone || !chapel || !password || !contact || !email || !ministry) {
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete Fields',
      text: 'Please fill in all fields before submitting.',
      confirmButtonColor: '#9D62F5'
    });
    return;
  }

  try {
    const snapshot = await get(ref(db, 'members'));
    const members = snapshot.exists() ? snapshot.val() : {};

    const emailExists = Object.values(members).some(member => member.Email === email);
    if (emailExists) {
      Swal.fire({
        icon: 'error',
        title: 'Email Already Taken',
        text: 'This email is already registered. Please use a different one.'
      });
      return;
    }

    const currentYear = new Date().getFullYear();
    let maxNumber = 0;
    Object.values(members).forEach(member => {
      if (member.MemberID && member.MemberID.startsWith(currentYear.toString())) {
        const num = parseInt(member.MemberID.split("-")[1]);
        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      }
    });

    const newNumber = maxNumber + 1;
    const paddedNumber = String(newNumber).padStart(3, '0');
    const memberID = `${currentYear}-${paddedNumber}`;

    // Create Firebase Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await sendEmailVerification(user);

    // Wait until user is authenticated (important for database write permission)
    await new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((u) => {
        if (u) {
          unsubscribe();
          resolve();
        }
      });
    });

    const uid = user.uid;
    const registeredAt = new Date().toISOString();

    const data = {
      uid,
      FirstName: firstName,
      MiddleName: midName,
      LastName: lastName,
      Username: userName,
      HomeAddress: address,
      Transparochial: transparochial,
      Position: position,
      Zone: transparochial === "Yes" ? "No Zone" : zone,
      Chapel: transparochial === "Yes" ? "No Chapel" : chapel,
      ContactNumber: contact,
      Email: email,
      Ministry: ministry,
      Approved: false,
      Role: "Member",
      MemberID: memberID,
      RegisteredAt: registeredAt
    };

    await set(ref(db, 'members/' + uid), data);
    localStorage.setItem("currentUID", uid);

    Swal.fire({
      icon: 'success',
      title: 'Sign Up Successful!',
      text: 'Waiting for admin approval...',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      window.location.href = "/html/thank-you-page.html";
    });

  } catch (error) {
    console.error("Error saving:", error);
    Swal.fire({
      icon: 'error',
      title: 'Registration Failed',
      text: 'Could not complete sign up. Please try again.'
    });
  }
});
