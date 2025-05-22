document.addEventListener('DOMContentLoaded', function() {
    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Validate inputs
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // API call to login
            loginUser(email, password);
        });
    }
    
    // Register Form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const userType = document.getElementById('user-type').value;
            const terms = document.getElementById('terms').checked;
            
            // Validate inputs
            if (!firstName || !lastName || !email || !phone || !password || !confirmPassword || !userType) {
                alert('Please fill in all required fields');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            if (password.length < 8) {
                alert('Password must be at least 8 characters');
                return;
            }
            
            if (!terms) {
                alert('You must agree to the terms and conditions');
                return;
            }
            
            // Prepare user data
            const userData = {
                firstName,
                lastName,
                email,
                phone,
                password,
                userType
            };
            
            // API call to register
            registerUser(userData);
        });
    }
    
    // Login User Function
    async function loginUser(email, password) {
        try {
            // Show loading state
            const loginBtn = loginForm.querySelector('button[type="submit"]');
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            
            // API call would go here
            // const response = await fetch('/api/login', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({ email, password })
            // });
            // const data = await response.json();
            
            // Mock response for demo
            setTimeout(() => {
                // Store user data in localStorage
                localStorage.setItem('currentUser', JSON.stringify({
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    email,
                    phone: '+265123456789',
                    userType: 'tourist',
                    token: 'mock-token-123'
                }));
                
                // Redirect to account page
                window.location.href = 'account.html';
            }, 1000);
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
            
            // Reset button
            const loginBtn = loginForm.querySelector('button[type="submit"]');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }
    }
    
    // Register User Function
    async function registerUser(userData) {
        try {
            // Show loading state
            const registerBtn = registerForm.querySelector('button[type="submit"]');
            registerBtn.disabled = true;
            registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
            
            // API call would go here
            // const response = await fetch('/api/register', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(userData)
            // });
            // const data = await response.json();
            
            // Mock response for demo
            setTimeout(() => {
                // Store user data in localStorage
                localStorage.setItem('currentUser', JSON.stringify({
                    id: 2,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    phone: userData.phone,
                    userType: userData.userType,
                    token: 'mock-token-456'
                }));
                
                // Redirect to account page
                window.location.href = 'account.html';
            }, 1000);
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
            
            // Reset button
            const registerBtn = registerForm.querySelector('button[type="submit"]');
            registerBtn.disabled = false;
            registerBtn.textContent = 'Create Account';
        }
    }
    
    // Check if user is already logged in
    function checkAuthState() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            // Redirect to account page if already logged in
            if (window.location.pathname.includes('login.html') || 
                window.location.pathname.includes('register.html')) {
                window.location.href = 'account.html';
            }
        }
    }
    
    // Initialize auth state check
    checkAuthState();
});