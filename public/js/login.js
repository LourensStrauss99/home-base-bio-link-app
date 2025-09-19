// Login script with Supabase - UMD version
// Initialize Supabase client using the global variable
const { createClient } = supabase;

const supabaseUrl = 'https://kiaqpvwcifgtiliwkxny.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpYXFwdndjaWZndGlsaXdreG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwOTc0OTQsImV4cCI6MjA3MzY3MzQ5NH0.wjy54c99IFy3h-XSONf3yaxeWZlI2Hfu6hvVut6dZTU';

const supabaseClient = createClient(supabaseUrl, supabaseKey);

console.log('Supabase client initialized:', supabaseClient);

// Supabase functions
const authFunctions = {
    async signIn(email, password) {
        try {
            console.log('Attempting Supabase login...', { email });
            
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) {
                console.error('Supabase login error:', error);
                throw error;
            }
            
            console.log('Supabase login success:', data);
            return { user: data.user, session: data.session };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async getCurrentUser() {
        try {
            const { data: { user } } = await supabaseClient.auth.getUser();
            return user;
        } catch (error) {
            console.error('Get current user error:', error);
            return null;
        }
    },

    onAuthStateChange(callback) {
        return supabaseClient.auth.onAuthStateChange(callback);
    },

    async ensureUserRecord(user) {
        try {
            console.log('Checking if user record exists for:', user.id);
            
            // Try to get user data
            const { data, error } = await supabaseClient
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && (error.code === 'PGRST116' || error.message.includes('No rows'))) {
                console.log('User record not found, creating one...');
                
                // Create user record from auth data
                const username = user.user_metadata?.username || 
                                user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
                
                const { data: newUserData, error: createError } = await supabaseClient
                    .from('users')
                    .upsert({
                        id: user.id,
                        email: user.email,
                        username: username,
                        bio: null,
                        photo_url: null,
                        updated_at: new Date().toISOString()
                    })
                    .select();

                if (createError) {
                    console.error('Error creating user record:', createError);
                    throw createError;
                }
                
                console.log('User record created successfully:', newUserData[0]);
                return newUserData[0];
            } else if (error) {
                console.error('Error checking user record:', error);
                throw error;
            } else {
                console.log('User record already exists:', data);
                return data;
            }
        } catch (error) {
            console.error('Error ensuring user record:', error);
            throw error;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    let isRedirecting = false;
    
    // Check if user is already logged in
    authFunctions.onAuthStateChange((event, session) => {
        if (session && !isRedirecting) {
            // User is signed in, redirect to admin
            isRedirecting = true;
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 100);
        }
    });

    // Password visibility toggle
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordInput = document.getElementById('password');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            
            // Toggle input type
            passwordInput.type = isPassword ? 'text' : 'password';
            
            // Toggle button class for styling
            passwordToggle.classList.toggle('visible', isPassword);
            
            // Update aria-label for accessibility
            passwordToggle.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        });
    }

    // Login form
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');
        
        // Show loading state
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;

        try {
            const result = await authFunctions.signIn(email, password);
            
            if (result.user) {
                console.log('Login successful, ensuring user record exists...');
                
                try {
                    // Ensure user record exists in users table
                    await authFunctions.ensureUserRecord(result.user);
                    console.log('User record verified/created');
                } catch (userRecordError) {
                    console.warn('Warning: Could not ensure user record:', userRecordError);
                    // Don't fail login if user record creation fails
                }
                
                alert('Logged in successfully!');
                window.location.href = 'admin.html';
            } else {
                alert('Login failed: No user returned');
            }
        } catch (error) {
            alert('Login error: ' + error.message);
        } finally {
            // Reset button state
            submitBtn.textContent = 'Login';
            submitBtn.disabled = false;
        }
    });

    // Theme toggle functionality
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const body = document.body;
        body.classList.toggle('dark-theme');
        body.classList.toggle('light-theme');
        
        // Save theme preference
        const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });

    // Load theme preference
    const theme = localStorage.getItem('theme');
    if (theme) {
        document.body.className = theme + '-theme';
    } else {
        document.body.className = 'light-theme';
    }
});