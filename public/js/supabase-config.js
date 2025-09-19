// Supabase Configuration
import { createClient } from 'https://unpkg.com/@supabase/supabase-js@2/dist/module/index.js'

// Supabase configuration
const supabaseUrl = 'https://kiaqpvwcifgtiliwkxny.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpYXFwdndjaWZndGlsaXdreG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwOTc0OTQsImV4cCI6MjA3MzY3MzQ5NH0.wjy54c99IFy3h-XSONf3yaxeWZlI2Hfu6hvVut6dZTU'

// Validate configuration
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and API key are required');
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

// Test the connection immediately
console.log('Supabase client initialized:', supabase)
console.log('Supabase URL:', supabaseUrl)
console.log('API Key (first 20 chars):', supabaseKey.substring(0, 20) + '...')

// Authentication functions
export const authFunctions = {
    // Sign up with email and password
    async signUp(email, password, userData = {}) {
        try {
            console.log('Attempting Supabase signup...', { email, userData })
            
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: userData // Additional user metadata
                }
            })
            
            if (error) {
                console.error('Supabase signup error:', error)
                throw error
            }
            
            console.log('Supabase signup success:', data)
            return { user: data.user, session: data.session }
        } catch (error) {
            console.error('Signup error:', error)
            throw error
        }
    },

    // Sign in with email and password
    async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            })
            
            if (error) throw error
            return { user: data.user, session: data.session }
        } catch (error) {
            console.error('Signin error:', error)
            throw error
        }
    },

    // Sign out
    async signOut() {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
        } catch (error) {
            console.error('Signout error:', error)
            throw error
        }
    },

    // Get current user
    async getCurrentUser() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            return user
        } catch (error) {
            console.error('Get current user error:', error)
            return null
        }
    },

    // Listen for auth state changes
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback)
    }
}

// Database functions
export const dbFunctions = {
    // Save user data to users table
    async saveUserData(userId, userData) {
        try {
            const { data, error } = await supabase
                .from('users')
                .upsert({
                    id: userId,
                    email: userData.email,
                    username: userData.username,
                    photo_url: userData.photo_url || null,
                    bio: userData.bio || null,
                    updated_at: new Date().toISOString()
                })
                .select()

            if (error) throw error
            console.log('User data saved:', data)
            return data[0]
        } catch (error) {
            console.error('Save user data error:', error)
            throw error
        }
    },

    // Get user data by ID
    async getUserData(userId) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Get user data error:', error)
            throw error
        }
    },

    // Get user data by username
    async getUserByUsername(username) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('username', username)
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Get user by username error:', error)
            throw error
        }
    },

    // Check if username exists
    async checkUsernameExists(username) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('username')
                .eq('username', username)
                .single()

            if (error && error.code !== 'PGRST116') throw error
            return !!data // Returns true if username exists
        } catch (error) {
            console.error('Check username error:', error)
            return false
        }
    },

    // Save user link
    async saveUserLink(userId, linkData) {
        try {
            const { data, error } = await supabase
                .from('user_links')
                .insert({
                    user_id: userId,
                    name: linkData.name,
                    url: linkData.url,
                    click_count: 0
                })
                .select()

            if (error) throw error
            return data[0]
        } catch (error) {
            console.error('Save user link error:', error)
            throw error
        }
    },

    // Get user links
    async getUserLinks(userId) {
        try {
            const { data, error } = await supabase
                .from('user_links')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: true })

            if (error) throw error
            return data || []
        } catch (error) {
            console.error('Get user links error:', error)
            return []
        }
    },

    // Update link click count
    async incrementClickCount(linkId) {
        try {
            const { data, error } = await supabase
                .from('user_links')
                .update({ click_count: supabase.raw('click_count + 1') })
                .eq('id', linkId)
                .select()

            if (error) throw error
            return data[0]
        } catch (error) {
            console.error('Increment click count error:', error)
            throw error
        }
    },

    // Delete user link
    async deleteUserLink(linkId) {
        try {
            const { error } = await supabase
                .from('user_links')
                .delete()
                .eq('id', linkId)

            if (error) throw error
        } catch (error) {
            console.error('Delete user link error:', error)
            throw error
        }
    }
}

// Storage functions for profile photos
export const storageFunctions = {
    // Upload profile photo
    async uploadProfilePhoto(userId, file) {
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${userId}/profile.${fileExt}`
            
            const { data, error } = await supabase.storage
                .from('profile-photos')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: true
                })

            if (error) throw error

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('profile-photos')
                .getPublicUrl(fileName)

            return urlData.publicUrl
        } catch (error) {
            console.error('Upload profile photo error:', error)
            throw error
        }
    },

    // Delete profile photo
    async deleteProfilePhoto(userId) {
        try {
            const { error } = await supabase.storage
                .from('profile-photos')
                .remove([`${userId}/profile`])

            if (error) throw error
        } catch (error) {
            console.error('Delete profile photo error:', error)
            throw error
        }
    }
}

// Export the Supabase client for direct use if needed
export { supabase }