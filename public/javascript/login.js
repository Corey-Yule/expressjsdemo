//Variables
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// Check which form should be active from server
if (window.serverActiveForm === 'signupForm') {
  loginForm.classList.remove('active');
  signupForm.classList.add('active');
  loginBtn.classList.remove('active');
  signupBtn.classList.add('active');
}

//Button Logic
loginBtn.addEventListener('click', () => {
  loginForm.classList.add('active');
  signupForm.classList.remove('active');
  loginBtn.classList.add('active');
  signupBtn.classList.remove('active');
});

signupBtn.addEventListener('click', () => {
  signupForm.classList.add('active');
  loginForm.classList.remove('active');
  signupBtn.classList.add('active');
  loginBtn.classList.remove('active');
});

// Grab the elements for the Login form
const loginToggle = document.getElementById('login-toggle');
const loginPassword = document.getElementById('login-password');

// Add listener for the Login toggle
if (loginToggle && loginPassword) {
    loginToggle.addEventListener('change', function() {
        // If the checkbox is checked, show text. Otherwise, hide it.
        loginPassword.type = this.checked ? 'text' : 'password';
    });
}

// Grab the elements for the Sign Up form
const signupToggle = document.getElementById('signup-toggle');
const signupPassword = document.getElementById('signup-password');

// Add listener for the Sign Up toggle
if (signupToggle && signupPassword) {
    signupToggle.addEventListener('change', function() {
        signupPassword.type = this.checked ? 'text' : 'password';
    });
}