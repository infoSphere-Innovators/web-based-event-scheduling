import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase, ref, set, get, push } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword
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
    // Get existing members to generate unique ID
    const snapshot = await get(ref(db, 'members'));
    const members = snapshot.exists() ? snapshot.val() : {};

    let prefix = "MEM";
    if (position === "Leader") prefix = "LEAD";
    else if (position === "Assistant") prefix = "ASSIST";

    let maxNumber = 0;
    Object.values(members).forEach(member => {
      if (member["MemberID"] && member["MemberID"].startsWith(prefix)) {
        const num = parseInt(member["MemberID"].split("-")[1]);
        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      }
    });

    const newNumber = maxNumber + 1;
    const paddedNumber = String(newNumber).padStart(3, '0');
    const memberID = `${prefix}-${paddedNumber}`;

    const newRef = push(ref(db, 'members'));

    // Create user in Firebase Authentication
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        // Optionally sign in if email already exists
        try {
          userCredential = await signInWithEmailAndPassword(auth, email, password);
          localStorage.setItem("currentUID", userCredential.user.uid);
          Swal.fire({
            icon: 'info',
            title: 'Already Registered',
            text: 'Signed in with existing account.',
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            window.location.href = "tryqr.html";
          });
          return; // Exit since data already exists
        } catch (signInError) {
          Swal.fire({
            icon: 'error',
            title: 'Email Already Registered',
            text: 'That email is already in use. Try a different one or log in.',
          });
          return;
        }
      } else {
        throw error;
      }
    }

    const user = userCredential.user;
    const uid = user.uid;
    await sendEmailVerification(user);
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
      Zone: zone,
      Chapel: chapel,
      ContactNumber: contact,
      Email: email,
      Ministry: ministry,
      Approved: false,
      Role: "Member",
      "MemberID": memberID,
      RegisteredAt: registeredAt
    };

    // ✅ Save under UID-based key
    const userRef = ref(db, 'members/' + uid);
    await set(userRef, data);

    localStorage.setItem("currentUID", uid);

    Swal.fire({
      icon: 'success',
      title: 'Sign Up Successful!',
      text: 'Redirecting to profile...',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      window.location.href = "/html/profile-details.html";
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
