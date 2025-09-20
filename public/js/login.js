// Login script with Laravel authentication
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    document.body.className = savedTheme;

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const body = document.body;
            const isDark = body.classList.contains('dark-theme');
            
            body.className = isDark ? 'light-theme' : 'dark-theme';
            
            // Save theme preference
            const currentTheme = isDark ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme + '-theme');
        });
    }

    // Password visibility toggle
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordInput = document.getElementById('password');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            
            passwordInput.type = isPassword ? 'text' : 'password';
            passwordToggle.classList.toggle('visible', isPassword);
            passwordToggle.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        });
    }

    // Check if user is already logged in
    checkAuthStatus();

    // Login form
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember')?.checked || false;
        const submitBtn = e.target.querySelector('button[type=\"submit\"]');
        
        // Basic validation
        if (!email || !password) {
            alert('Please enter both email and password!');
            return;
        }
        
        // Show loading state
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;

        try {
            console.log('Sending login request to Laravel...');

            // Get CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            console.log('CSRF token:', csrfToken ? 'Found' : 'Not found');

            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    remember: remember
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                console.log('Login successful:', result);
                alert('Logged in successfully!');
                
                // Check if there's an intended redirect URL, otherwise go to admin dashboard
                const urlParams = new URLSearchParams(window.location.search);
                const intended = urlParams.get('intended') || '/admin/dashboard';
                window.location.href = intended;
            } else {
                console.error('Login failed:', result);
                if (result.errors) {
                    // Display validation errors
                    const errorMessages = Object.values(result.errors).flat();
                    alert('Login failed:\n' + errorMessages.join('\n'));
                } else {
                    alert('Login failed: ' + (result.message || 'Invalid credentials'));
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login error: ' + error.message);
        } finally {
            // Reset button state
            submitBtn.textContent = 'Login';
            submitBtn.disabled = false;
        }
    });
});

// Function to check authentication status
async function checkAuthStatus() {
    try {
        const response = await fetch('/check-auth', {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        const result = await response.json();

        if (result.authenticated) {
            console.log('User already authenticated, redirecting to dashboard...');
            window.location.href = '/admin/dashboard';
        }
    } catch (error) {
        console.log('Auth check failed (expected for non-authenticated users):', error);
        // This is expected for non-authenticated users, so we don't show an error
    }
}
