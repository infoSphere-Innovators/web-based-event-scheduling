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

// Add these validation functions at the top of your script.js file
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhoneNumber(phone) {
  const phoneRegex = /^[0-9]{11}$/;
  return phoneRegex.test(phone);
}

// Add this validation function for password
function isValidPassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  return passwordRegex.test(password);
}

// Create password strength checker
function checkPasswordStrength(password) {
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength += 1;
  
  // Lowercase check
  if (/[a-z]/.test(password)) strength += 1;
  
  // Uppercase check
  if (/[A-Z]/.test(password)) strength += 1;
  
  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
  
  return {
    score: strength,
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    hasLength: password.length >= 8
  };
}

// Handle transparochial toggle
document.getElementById("trasparochial").addEventListener("change", function () {
  const transparochial = this.value;
  const zone = document.getElementById("zone");
  const chapel = document.getElementById("chapel");

  if (transparochial === "Yes") {
    // Set to "No Zone" and "No Chapel" as these are valid values in your system
    zone.value = "No Zone";
    chapel.innerHTML = '<option value="No Chapel" selected>No Chapel</option>';
    zone.disabled = true;
    chapel.disabled = true;
  } else {
    zone.disabled = false;
    chapel.disabled = false;
    zone.value = "";
    chapel.innerHTML = '<option value="" disabled selected>Select...</option>';
  }
});

// Zone-to-Chapel map
const zoneChapelMap = {
  "Zone 1": [
    "St. Peter Chapel",
    "St. Anne Chapel",
    "Sistine Chapel",
    "Holy Spirit Chapel",
    "Our Lady of Sorrows Chapel"
  ],
  "Zone 2": [
    "San Lorenzo Chapel",
    "St. Jude Chapel",
    "Divine Mercy Chapel",
    "Immaculate Conception Chapel",
    "St. Benedict Chapel"
  ],
  "Zone 3": [
    "Sta. Maria Chapel",
    "St. Joseph Chapel",
    "Christ the King Chapel",
    "San Sebastian Chapel",
    "Our Lady of Mt. Carmel Chapel"
  ],
  "Zone 4": [
    "St. Michael Chapel",
    "St. Augustine Chapel",
    "Mother of Perpetual Help Chapel",
    "Sacred Heart Chapel",
    "San Antonio Chapel"
  ],
  "Zone 5": [
    "Holy Cross Chapel",
    "St. Therese Chapel",
    "St. John the Baptist Chapel",
    "San Roque Chapel",
    "Our Lady of Guadalupe Chapel"
  ],
  "Zone 6": [
    "St. Dominic Chapel",
    "St. Paul Chapel",
    "St. Clare Chapel",
    "Our Lady of Fatima Chapel",
    "St. Ignatius Chapel"
  ],
  "Zone 7": [
    "St. Francis Chapel",
    "St. Andrew Chapel",
    "St. Cecilia Chapel",
    "St. Martin Chapel",
    "St. Matthew Chapel"
  ]
};

// Update chapel options when zone changes
const zoneSelect = document.getElementById("zone");
const chapelSelect = document.getElementById("chapel");

zoneSelect.addEventListener("change", function () {
  const selectedZone = this.value;
  const chapels = zoneChapelMap[selectedZone] || [];

  chapelSelect.innerHTML = '<option value="" disabled selected>Select...</option>';

  chapels.forEach(chapel => {
    const option = document.createElement("option");
    option.value = chapel;
    option.textContent = chapel;
    chapelSelect.appendChild(option);
  });
});

// Handle form submission - update the event listener for submit button
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

  // Modified validation to account for transparochial case
  if (!firstName || !midName || !lastName || !userName || !address || !transparochial || 
      !position || !password || !contact || !email || !ministry ||
      (transparochial === "No" && (!zone || !chapel))) {
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete Fields',
      text: 'Please fill in all required fields before submitting.',
      confirmButtonColor: '#9D62F5'
    });
    return;
  }

  // Validate name fields
  if (!isValidName(firstName) || !isValidName(midName) || !isValidName(lastName)) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Name Format',
      text: 'Names can only contain letters, spaces, hyphens, and apostrophes.',
      confirmButtonColor: '#9D62F5'
    });
    return;
  }

  // Validate email format
  if (!isValidEmail(email)) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Email',
      text: 'Please enter a valid email address.',
      confirmButtonColor: '#9D62F5'
    });
    return;
  }

  // Validate contact number (must be 11 digits, numbers only)
  if (!isValidPhoneNumber(contact)) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Contact Number',
      text: 'Contact number must be exactly 11 digits with no letters or special characters.',
      confirmButtonColor: '#9D62F5'
    });
    return;
  }

  // Validate password strength
  if (!isValidPassword(password)) {
    Swal.fire({
      icon: 'error',
      title: 'Weak Password',
      text: 'Password must be at least 8 characters with at least one lowercase letter, one uppercase letter, and one special character.',
      confirmButtonColor: '#9D62F5'
    });
    return;
  }

  try {
    const snapshot = await get(ref(db, 'members'));
    const members = snapshot.exists() ? snapshot.val() : {};

    // Check for existing email
    const emailExists = Object.values(members).some(member => member.Email === email);
    if (emailExists) {
      Swal.fire({
        icon: 'error',
        title: 'Email Already Taken',
        text: 'This email is already registered. Please use a different one.'
      });
      return;
    }

    // Check for existing username
    const usernameExists = Object.values(members).some(member => 
      member.Username && member.Username.toLowerCase() === userName.toLowerCase()
    );
    if (usernameExists) {
      Swal.fire({
        icon: 'error',
        title: 'Username Already Taken',
        text: 'This username is already registered. Please choose a different one.'
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

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await sendEmailVerification(user);

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

// Real-time validation for email and contact number
document.getElementById("email").addEventListener('input', function() {
  const email = this.value.trim();
  const emailError = document.getElementById("email-error") || 
                    createErrorElement("email-error", this);
  
  if (email && !isValidEmail(email)) {
    emailError.textContent = "Please enter a valid email address";
    emailError.style.display = "block";
    this.style.borderColor = "#ff3860";
  } else {
    emailError.style.display = "none";
    this.style.borderColor = email ? "#00d1b2" : "";
  }
});

document.getElementById("contact").addEventListener('input', function() {
  const contact = this.value.trim();
  const contactError = document.getElementById("contact-error") || 
                      createErrorElement("contact-error", this);
  
  // Remove any non-digit characters
  if (/[^0-9]/.test(contact)) {
    this.value = contact.replace(/[^0-9]/g, '');
  }
  
  // Check length
  if (contact && contact.length !== 11) {
    contactError.textContent = "Contact number must be exactly 11 digits";
    contactError.style.display = "block";
    this.style.borderColor = "#ff3860";
  } else {
    contactError.style.display = "none";
    this.style.borderColor = contact ? "#00d1b2" : "";
  }
  
  // Limit to 11 digits
  if (contact.length > 11) {
    this.value = contact.slice(0, 11);
  }
});

// Add this after your other event listeners
document.getElementById("password").addEventListener('input', function() {
  const password = this.value;
  const passwordError = document.getElementById("password-error") || 
                      createErrorElement("password-error", this);
  
  // Check if password strength container exists, if not create it
  let strengthContainer = document.getElementById("password-strength-container");
  if (!strengthContainer) {
    strengthContainer = document.createElement("div");
    strengthContainer.id = "password-strength-container";
    this.parentNode.insertBefore(strengthContainer, this.nextSibling);
    
    // Create password requirements list
    const requirementsList = document.createElement("ul");
    requirementsList.className = "password-requirements";
    requirementsList.style.listStyle = "none";
    requirementsList.style.padding = "0";
    requirementsList.style.margin = "8px 0 0 0";
    
    // Add requirements
    const requirements = [
      { id: "length-req", text: "At least 8 characters" },
      { id: "lowercase-req", text: "At least 1 lowercase letter" },
      { id: "uppercase-req", text: "At least 1 uppercase letter" },
      { id: "special-req", text: "At least 1 special character" }
    ];
    
    requirements.forEach(req => {
      const li = document.createElement("li");
      li.id = req.id;
      li.className = "password-requirement";
      
      // Add circle indicator
      const circle = document.createElement("span");
      circle.className = "requirement-circle";
      li.appendChild(circle);
      
      // Add requirement text
      const text = document.createTextNode(req.text);
      li.appendChild(text);
      
      requirementsList.appendChild(li);
    });
    
    strengthContainer.appendChild(requirementsList);
  }
  
  // Check password strength
  const strengthResult = checkPasswordStrength(password);
  
  // Update strength indicators
  const lengthReq = document.getElementById("length-req");
  const lowercaseReq = document.getElementById("lowercase-req");
  const uppercaseReq = document.getElementById("uppercase-req");
  const specialReq = document.getElementById("special-req");
  
  updateRequirement(lengthReq, strengthResult.hasLength);
  updateRequirement(lowercaseReq, strengthResult.hasLower);
  updateRequirement(uppercaseReq, strengthResult.hasUpper);
  updateRequirement(specialReq, strengthResult.hasSpecial);
  
  // Update border color based on overall strength
  if (password.length === 0) {
    this.style.borderColor = "";
    this.classList.remove("error", "success");
  } else if (strengthResult.score < 4) {
    this.style.borderColor = "#ff3860";
    this.classList.add("error");
    this.classList.remove("success");
  } else {
    this.style.borderColor = "#00d1b2";
    this.classList.add("success");
    this.classList.remove("error");
  }
  
  // Update error message
  if (password && !isValidPassword(password)) {
    passwordError.textContent = "Password doesn't meet all requirements";
    passwordError.style.display = "block";
  } else {
    passwordError.style.display = "none";
  }
});

// Updated function to update requirement indicators with circles
function updateRequirement(element, isMet) {
  if (isMet) {
    element.classList.add("requirement-met");
  } else {
    element.classList.remove("requirement-met");
  }
}

// Helper function to create error message elements
function createErrorElement(id, inputElement) {
  const errorElement = document.createElement("p");
  errorElement.id = id;
  errorElement.className = "error-message";
  errorElement.style.color = "#ff3860";
  errorElement.style.fontSize = "0.85rem";
  errorElement.style.marginTop = "5px";
  errorElement.style.display = "none";
  
  // Insert error message after the input element
  inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
  
  return errorElement;
}

// Add this validation function for names (no numbers or special characters allowed)
function isValidName(name) {
  const nameRegex = /^[A-Za-z\s\-']+$/; // Only letters, spaces, hyphens, and apostrophes
  return nameRegex.test(name);
}

// Add real-time validation for name fields
document.querySelectorAll('#firstname, #middlename, #lastname').forEach(input => {
  input.addEventListener('input', function() {
    const name = this.value.trim();
    const fieldName = this.id === 'firstname' ? 'First name' : 
                      this.id === 'middlename' ? 'Middle name' : 'Last name';
    
    const errorId = `${this.id}-error`;
    const nameError = document.getElementById(errorId) || createErrorElement(errorId, this);
    
    // Remove any numbers or special characters as they're typed
    if (/[^A-Za-z\s\-']/.test(name)) {
      this.value = name.replace(/[^A-Za-z\s\-']/g, '');
    }
    
    if (name && !isValidName(name)) {
      nameError.textContent = `${fieldName} cannot contain numbers or special characters`;
      nameError.style.display = "block";
      this.style.borderColor = "#ff3860";
      this.classList.add("error");
      this.classList.remove("success");
    } else {
      nameError.style.display = "none";
      this.style.borderColor = name ? "#00d1b2" : "";
      if (name) {
        this.classList.add("success");
        this.classList.remove("error");
      } else {
        this.classList.remove("success", "error");
      }
    }
  });
});

// Add debounce function to limit API calls
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Add real-time username availability check
document.getElementById("username").addEventListener('input', debounce(async function() {
  const username = this.value.trim();
  const usernameError = document.getElementById("username-error") || 
                        createErrorElement("username-error", this);
  
  if (username.length < 3) {
    usernameError.textContent = "Username must be at least 3 characters";
    usernameError.style.display = "block";
    this.style.borderColor = "#ff3860";
    this.classList.add("error");
    this.classList.remove("success");
    return;
  }
  
  try {
    // Show checking indicator
    usernameError.textContent = "Checking availability...";
    usernameError.style.display = "block";
    usernameError.style.color = "#6c757d"; // Gray color for neutral message
    
    // Check if username exists in database
    const snapshot = await get(ref(db, 'members'));
    const members = snapshot.exists() ? snapshot.val() : {};
    
    const usernameExists = Object.values(members).some(member => 
      member.Username && member.Username.toLowerCase() === username.toLowerCase()
    );
    
    if (usernameExists) {
      usernameError.textContent = "This username is already taken";
      usernameError.style.display = "block";
      usernameError.style.color = "#ff3860"; // Red for error
      this.style.borderColor = "#ff3860";
      this.classList.add("error");
      this.classList.remove("success");
    } else {
      usernameError.textContent = "Username is available";
      usernameError.style.display = "block";
      usernameError.style.color = "#00d1b2"; // Green for success
      this.style.borderColor = "#00d1b2";
      this.classList.add("success");
      this.classList.remove("error");
      
      // Auto-hide the success message after 2 seconds
      setTimeout(() => {
        if (usernameError.textContent === "Username is available") {
          usernameError.style.display = "none";
        }
      }, 2000);
    }
  } catch (error) {
    console.error("Error checking username:", error);
    usernameError.textContent = "Couldn't verify username availability";
    usernameError.style.display = "block";
    usernameError.style.color = "#ff3860";
  }
}, 500)); // 500ms delay before checking

// Add this to your script.js file where you initialize other SweetAlert messages

// Custom SweetAlert styling configuration
const customSwalStyles = {
  // Error message styling
  error: {
    confirmButtonColor: '#2E2E2E', // Deep Charcoal button
    cancelButtonColor: '#F4C430', // Church Gold for cancel buttons
    iconColor: '#FF5252', // Bright red for error icon
    color: '#2E2E2E', // Text color
    background: '#FFFFFF', // White background
    backdrop: 'rgba(0,0,0,0.4)', // Slightly darker backdrop for emphasis
    showClass: {
      popup: 'animate__animated animate__fadeInUp animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutDown animate__faster'
    },
    // Custom styling using didOpen hook
    didOpen: (toast) => {
      // Add a distinctive red border at the top
      toast.querySelector('.swal2-popup').style.borderTop = '4px solid #FF5252';
      // Add subtle shadow for depth
      toast.querySelector('.swal2-popup').style.boxShadow = '0 5px 25px rgba(0,0,0,0.2)';
      // Make the title more prominent
      const title = toast.querySelector('.swal2-title');
      if (title) {
        title.style.fontSize = '1.3rem';
        title.style.fontWeight = '700';
      }
      // Style the content text
      const content = toast.querySelector('.swal2-html-container');
      if (content) {
        content.style.fontSize = '0.95rem';
        content.style.lineHeight = '1.5';
        content.style.marginTop = '0.8rem';
      }
    }
  }
};

// Apply the custom styling to existing SweetAlert calls
// Update all your SweetAlert error messages to use this approach

// Example of how to use this with your existing code:
function showErrorAlert(title, text) {
  Swal.fire({
    icon: 'error',
    title: title,
    text: text,
    confirmButtonColor: customSwalStyles.error.confirmButtonColor,
    iconColor: customSwalStyles.error.iconColor,
    background: customSwalStyles.error.background,
    backdrop: customSwalStyles.error.backdrop,
    didOpen: customSwalStyles.error.didOpen,
    ...customSwalStyles.error.showClass,
    ...customSwalStyles.error.hideClass
  });
}

// Then replace your existing error alerts with this function:
// Instead of:
// Swal.fire({
//   icon: 'error',
//   title: 'Invalid Name Format',
//   text: 'Names can only contain letters, spaces, hyphens, and apostrophes.',
//   confirmButtonColor: '#9D62F5'
// });

// Use:
// showErrorAlert(
//   'Invalid Name Format', 
//   'Names can only contain letters, spaces, hyphens, and apostrophes.'
// );
