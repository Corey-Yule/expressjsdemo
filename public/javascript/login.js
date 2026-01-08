//Variablesw
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