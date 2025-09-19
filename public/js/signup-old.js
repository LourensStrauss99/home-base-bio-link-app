// Signup script with Supabase
import { authFunctions, dbFunctions, storageFunctions } from './supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    let isRedirecting = false;
    
    // Check if user is already logged in
    authFunctions.onAuthStateChange((event, session) => {
        if (session?.user && !isRedirecting) {
            // User is signed in, redirect to admin
            isRedirecting = true;
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 100);
        }
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'theme-light';
    document.body.className = savedTheme; // Replace all classes with saved theme

    // Theme change (if theme selector exists)
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
                
                // Toggle input type
                passwordInput.type = isPassword ? 'text' : 'password';
                
                // Toggle button class for styling
                toggle.classList.toggle('visible', isPassword);
                
                // Update aria-label for accessibility
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
        
        const username = document.getElementById('username').value.toLowerCase().trim();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');
        
        // Debug: Log what we're getting from the form
        console.log('Form data collected:');
        console.log('Username:', username);
        console.log('Email:', email);
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
            // Check if username is already taken
            console.log('Checking username availability for:', username);
            const usernameExists = await dbFunctions.checkUsernameExists(username);
            console.log('Username exists check result:', usernameExists);
            
            if (usernameExists) {
                alert('Username is already taken! Please choose a different one.');
                submitBtn.textContent = 'Sign Up';
                submitBtn.disabled = false;
                return;
            }
            
            console.log('Creating Supabase user account...');
            const result = await authFunctions.signUp(email, password, { username });
            
            if (result.user) {
                // Upload profile photo if selected
                let photoURL = null;
                
                if (selectedPhotoFile) {
                    submitBtn.textContent = 'Uploading Photo...';
                    try {
                        photoURL = await storageFunctions.uploadProfilePhoto(result.user.id, selectedPhotoFile);
                        console.log('Photo uploaded successfully:', photoURL);
                    } catch (photoError) {
                        console.warn('Photo upload failed:', photoError);
                        // Continue without photo rather than failing signup
                    }
                }
                
                submitBtn.textContent = 'Saving Profile...';
                
                // Save user data to users table
                const userData = {
                    email: email,
                    username: username,
                    photo_url: photoURL
                };
                
                console.log('Saving user data to Supabase:', userData);
                const savedUser = await dbFunctions.saveUserData(result.user.id, userData);
                console.log('User data saved:', savedUser);
                
                alert('Account created successfully! Your HomeBase link is: ' + window.location.origin + '/HomeBase/profile.html?user=' + username);
                window.location.href = 'admin.html';
            } else {
                throw new Error('Failed to create account');
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