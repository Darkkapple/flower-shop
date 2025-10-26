class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.bindAuthEvents();
    }

    bindAuthEvents() {
        // Login form handler
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form handler
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    async handleLogin(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok) {
                this.showNotification('Login successful!', 'success');
                this.currentUser = data.user;
                this.updateUI();

                // Redirect to home page after short delay
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } else {
                this.showNotification(data.error, 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Login failed. Please try again.', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

        // Client-side validation
        if (userData.password !== userData.confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        if (userData.password.length < 6) {
            this.showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                this.showNotification('Registration successful! Please login.', 'success');

                // Redirect to login page
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                this.showNotification(data.error, 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showNotification('Registration failed. Please try again.', 'error');
        }
    }

    async handleLogout() {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST'
            });

            if (response.ok) {
                this.currentUser = null;
                this.showNotification('Logged out successfully', 'success');
                this.updateUI();

                // Redirect to home page
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            }
        } catch (error) {
            console.error('Logout error:', error);
            this.showNotification('Logout failed', 'error');
        }
    }

    async checkAuthStatus() {
        try {
            const response = await fetch('/api/auth/status');
            const data = await response.json();

            if (data.authenticated) {
                this.currentUser = data.user;
                this.updateUI();
            }
        } catch (error) {
            console.log('Not authenticated');
        }
    }

    updateUI() {
        const loginBtn = document.getElementById('login-btn');
        const userInfo = document.getElementById('user-info');
        const usernameSpan = document.getElementById('username');
        const adminPanelLink = document.getElementById('admin-panel-link');

        if (this.currentUser) {
            // User is logged in
            if (loginBtn) loginBtn.style.display = 'none';
            if (userInfo) userInfo.style.display = 'block';
            if (usernameSpan) usernameSpan.textContent = this.currentUser.username;

            // Show admin panel link for admins
            if (adminPanelLink) {
                adminPanelLink.style.display = this.currentUser.isAdmin ? 'block' : 'none';
            }

            // Update protected elements
            const protectedElements = document.querySelectorAll('[data-auth-required]');
            protectedElements.forEach(el => {
                el.style.display = 'block';
            });
        } else {
            // User is not logged in
            if (loginBtn) loginBtn.style.display = 'block';
            if (userInfo) userInfo.style.display = 'none';

            // Hide protected elements
            const protectedElements = document.querySelectorAll('[data-auth-required]');
            protectedElements.forEach(el => {
                el.style.display = 'none';
            });
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add styles based on type
        const styles = {
            success: { background: '#28a745', color: 'white' },
            error: { background: '#dc3545', color: 'white' },
            info: { background: '#17a2b8', color: 'white' }
        };

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            zIndex: '1000',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            animation: 'slideIn 0.3s ease',
            ...styles[type]
        });

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    // Utility method to check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Utility method to check if user is admin
    isAdmin() {
        return this.currentUser && this.currentUser.isAdmin;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});