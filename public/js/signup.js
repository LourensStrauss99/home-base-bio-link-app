// Signup script with Laravel authentication
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    document.body.className = savedTheme;

    // Theme change
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.value = savedTheme;
        themeSelect.addEventListener('change', (e) => {
            const newTheme = e.target.value;
            document.body.className = newTheme;
            localStorage.setItem('theme', newTheme);
        });
    }

    // Password visibility toggles
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach((toggle, index) => {
        const passwordInput = index === 0 ? 
            document.getElementById('password') : 
            document.getElementById('confirm-password');
        
        if (toggle && passwordInput) {
            toggle.addEventListener('click', () => {
                const isPassword = passwordInput.type === 'password';
                
                passwordInput.type = isPassword ? 'text' : 'password';
                toggle.classList.toggle('visible', isPassword);
                toggle.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
            });
        }
    });

    // Photo upload preview functionality
    const profilePhotoInput = document.getElementById('profile-photo');
    const photoPreview = document.getElementById('photo-preview');
    const previewImage = document.getElementById('preview-image');
    const removePhotoBtn = document.getElementById('remove-photo');
    let selectedPhotoFile = null;

    if (profilePhotoInput) {
        profilePhotoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            
            if (file) {
                // Validate file size
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB');
                    profilePhotoInput.value = '';
                    return;
                }
                
                // Validate file type
                const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (!allowedTypes.includes(file.type)) {
                    alert('Only JPG, PNG, GIF, and WebP files are allowed');
                    profilePhotoInput.value = '';
                    return;
                }
                
                // Show preview
                selectedPhotoFile = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImage.src = e.target.result;
                    photoPreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Remove photo functionality
        if (removePhotoBtn) {
            removePhotoBtn.addEventListener('click', () => {
                selectedPhotoFile = null;
                profilePhotoInput.value = '';
                photoPreview.style.display = 'none';
                previewImage.src = '';
            });
        }
    }

    // Signup form
    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submitted, preventing default action');
        
        const username = document.getElementById('username').value.toLowerCase().trim();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const bio = document.getElementById('bio').value.trim();
        const submitBtn = e.target.querySelector('button[type=\"submit\"]');
        
        // Debug: Log what we're getting from the form
        console.log('Form data collected:');
        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Bio:', bio);
        console.log('Selected photo file:', selectedPhotoFile);
        
        // Validate username
        if (!username || username === '') {
            alert('Please enter a username!');
            return;
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            alert('Username can only contain letters, numbers, and underscores!');
            return;
        }

        if (username.length < 3 || username.length > 20) {
            alert('Username must be between 3-20 characters!');
            return;
        }
        
        // Validate passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Validate password length
        if (password.length < 6) {
            alert('Password must be at least 6 characters long!');
            return;
        }
        
        // Show loading state
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('password_confirmation', confirmPassword);
            formData.append('bio', bio);

            if (selectedPhotoFile) {
                formData.append('profile_photo', selectedPhotoFile);
            }

            console.log('Sending signup request to Laravel...');

            // Get CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            console.log('CSRF token:', csrfToken ? 'Found' : 'Not found');

            const response = await fetch('/register', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken
                    // Don't set Content-Type for FormData - let browser set it with boundary
                }
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            const result = await response.json();
            console.log('Response data:', result);

            if (response.ok) {
                console.log('Signup successful:', result);
                alert('Account created successfully! Redirecting to login...');
                window.location.href = '/login';
            } else {
                console.error('Signup failed:', result);
                if (result.errors) {
                    // Display validation errors
                    const errorMessages = Object.values(result.errors).flat();
                    alert('Signup failed:\n' + errorMessages.join('\n'));
                } else {
                    alert('Signup failed: ' + (result.message || 'Unknown error'));
                }
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('Signup error: ' + error.message);
        } finally {
            // Reset button state
            submitBtn.textContent = 'Sign Up';
            submitBtn.disabled = false;
        }
    });
});
