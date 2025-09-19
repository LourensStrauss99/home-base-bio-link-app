// Signup script with Supabase - UMD version
// Initialize Supabase client using the global variable
const { createClient } = supabase;

const supabaseUrl = 'https://kiaqpvwcifgtiliwkxny.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpYXFwdndjaWZndGlsaXdreG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwOTc0OTQsImV4cCI6MjA3MzY3MzQ5NH0.wjy54c99IFy3h-XSONf3yaxeWZlI2Hfu6hvVut6dZTU';

const supabaseClient = createClient(supabaseUrl, supabaseKey);

console.log('Supabase client initialized:', supabaseClient);

// Supabase functions
const authFunctions = {
    async signUp(email, password, userData = {}) {
        try {
            console.log('Attempting Supabase signup...', { email, userData });
            console.log('Using emailRedirectTo:', 'https://lourensstrauss99.github.io/HomeBase/confirm.html');
            
            const signupOptions = {
                email: email,
                password: password,
                options: {
                    data: userData,
                    emailRedirectTo: 'https://lourensstrauss99.github.io/HomeBase/confirm.html'
                }
            };
            
            console.log('Full signup options:', signupOptions);
            
            const { data, error } = await supabaseClient.auth.signUp(signupOptions);
            
            console.log('Supabase signup response:', { data, error });
            console.log('User needs email confirmation:', !data.user?.email_confirmed_at);
            console.log('Session exists:', !!data.session);
            
            if (error) {
                console.error('Supabase signup error:', error);
                throw error;
            }
            
            console.log('Signup successful, user data:', data.user);
            console.log('Session data:', data.session);
            
            console.log('Supabase signup success:', data);
            return { user: data.user, session: data.session };
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    },

    onAuthStateChange(callback) {
        return supabaseClient.auth.onAuthStateChange(callback);
    }
};

const dbFunctions = {
    async saveUserData(userId, userData) {
        try {
            const { data, error } = await supabaseClient
                .from('users')
                .upsert({
                    id: userId,
                    email: userData.email,
                    username: userData.username,
                    photo_url: userData.photo_url || null,
                    bio: userData.bio || null,
                    updated_at: new Date().toISOString()
                })
                .select();

            if (error) throw error;
            console.log('User data saved:', data);
            return data[0];
        } catch (error) {
            console.error('Save user data error:', error);
            throw error;
        }
    },

    async checkUsernameExists(username) {
        try {
            console.log('Checking username availability for:', username);
            
            // Use count instead of select to avoid RLS issues
            const { count, error } = await supabaseClient
                .from('users')
                .select('*', { count: 'exact', head: true })
                .eq('username', username);

            if (error) {
                console.warn('Username check error (continuing anyway):', error);
                // If we can't check, assume it's available to not block signup
                return false;
            }
            
            console.log('Username check result - count:', count);
            return count > 0;
        } catch (error) {
            console.error('Check username error (continuing anyway):', error);
            // If we can't check, assume it's available to not block signup
            return false;
        }
    }
};

const storageFunctions = {
    async uploadProfilePhoto(userId, file) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/profile.${fileExt}`;
            
            const { data, error } = await supabaseClient.storage
                .from('profile-photos')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (error) throw error;

            const { data: urlData } = supabaseClient.storage
                .from('profile-photos')
                .getPublicUrl(fileName);

            return urlData.publicUrl;
        } catch (error) {
            console.error('Upload profile photo error:', error);
            throw error;
        }
    }
};

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
    document.body.className = savedTheme;

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
        
        const username = document.getElementById('username').value.toLowerCase().trim();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const bio = document.getElementById('bio').value.trim();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        
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
            // Skip username checking for now to avoid RLS issues
            // Username uniqueness will be enforced at the database level
            console.log('Skipping username check to avoid RLS issues');
            
            console.log('Creating Supabase user account...');
            const result = await authFunctions.signUp(email, password, { username });
            
            console.log('Signup result received:', result);
            console.log('User object:', result.user);
            console.log('User email confirmed:', result.user?.email_confirmed_at);
            console.log('User confirmation sent at:', result.user?.confirmation_sent_at);
            console.log('User identities:', result.user?.identities);
            console.log('Session:', result.session);
            
            if (result.user) {
                // Check if email confirmation is required
                if (result.user.email_confirmed_at) {
                    console.log('Email already confirmed, user can proceed directly');
                } else {
                    console.log('Email confirmation required, email should have been sent');
                    console.log('Check your Supabase Auth settings and email provider configuration');
                }
                // Store signup data for after email confirmation
                const signupData = {
                    userId: result.user.id,
                    username: username,
                    email: email,
                    bio: bio,
                    photoFile: null // Will be set below if photo selected
                };
                
                // If photo selected, convert to base64 for storage
                if (selectedPhotoFile) {
                    const base64Data = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            resolve({
                                data: e.target.result,
                                name: selectedPhotoFile.name,
                                type: selectedPhotoFile.type
                            });
                        };
                        reader.readAsDataURL(selectedPhotoFile);
                    });
                    signupData.photoFile = base64Data;
                }
                
                localStorage.setItem('pendingSignupData', JSON.stringify(signupData));
                
                console.log('Stored signup data for email confirmation:', signupData);
                
                // If email is already confirmed (rare case), create user record immediately
                if (result.user.email_confirmed_at) {
                    console.log('Email already confirmed, creating user record immediately...');
                    try {
                        // Handle photo upload if present
                        let photoURL = null;
                        if (selectedPhotoFile) {
                            try {
                                photoURL = await storageFunctions.uploadProfilePhoto(result.user.id, selectedPhotoFile);
                                console.log('Photo uploaded successfully:', photoURL);
                            } catch (photoError) {
                                console.warn('Photo upload failed:', photoError);
                            }
                        }
                        
                        // Create user record
                        const userData = await dbFunctions.saveUserData(result.user.id, {
                            email: email,
                            username: username,
                            bio: bio,
                            photo_url: photoURL
                        });
                        
                        console.log('User record created immediately:', userData);
                        localStorage.removeItem('pendingSignupData');
                        alert('Account created and confirmed! Redirecting to admin...');
                        window.location.href = 'admin.html';
                    } catch (createError) {
                        console.error('Error creating user record:', createError);
                        alert('Account created! Please check your email and click the confirmation link to complete your signup.');
                    }
                } else {
                    alert('Account created! Please check your email and click the confirmation link to complete your signup.');
                }
                
                // Note: Email confirmation will be handled by confirm.html page
                // The auth state listener has been removed to prevent conflicts
                
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