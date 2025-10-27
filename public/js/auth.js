/**
 * Authentication Manager for Flower Shop
 * Handles user authentication, registration, and session management
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;

         console.log('🔐 Менеджер авторизации инициализируется...');
        this.bindAuthEvents();
        this.checkAuthStatus();
        this.setupFormValidation();

        this.isInitialized = true;
        console.log('🔐 Менеджер авторизации успешно инициализирован');
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

        // Mobile logout
        const mobileLogoutBtn = document.querySelector('.logout-btn-mobile');
        if (mobileLogoutBtn) {
            mobileLogoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Password strength indicator
        const passwordInput = document.getElementById('reg-password');
        if (passwordInput) {
            passwordInput.addEventListener('input', () => this.updatePasswordStrength());
        }

        // Confirm password validation
        const confirmPasswordInput = document.getElementById('reg-confirm-password');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => this.validatePasswordMatch());
        }
    }

    setupFormValidation() {
        // Real-time validation for forms
        const forms = document.querySelectorAll('form[data-validate]');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

async handleLogin(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        // Validate form
        if (!this.validateForm(form)) {
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        this.setButtonLoading(submitBtn, true);

         try {
            // Simulate API call
            console.log('Попытка входа для:', credentials.username);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock successful login
            const mockUser = {
                id: 1,
                username: credentials.username,
                email: `${credentials.username}@example.com`,
                isAdmin: credentials.username === 'admin'
            };

            this.currentUser = mockUser;
            this.saveUserToStorage(mockUser);
            this.updateUI();

            this.showNotification('Вход выполнен успешно! Добро пожаловать!', 'success');

            // Redirect to home page after short delay
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);

        } catch (error) {
            console.error('Ошибка входа:', error);
            this.showNotification('Неверное имя пользователя или пароль. Пожалуйста, попробуйте еще раз.', 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

       // Validate form
        if (!this.validateForm(form)) {
            return;
        }

        // Check password match
        if (userData.password !== userData.confirmPassword) {
            this.showFieldError('reg-confirm-password', 'Пароли не совпадают');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        this.setButtonLoading(submitBtn, true);

        try {
            // Simulate API call
            console.log('Попытка регистрации для:', userData.username);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock successful registration
            this.showNotification('Регистрация прошла успешно! Пожалуйста, войдите.', 'success');

            // Redirect to login page after delay
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);

        } catch (error) {
            console.error('Ошибка регистрации:', error);
            this.showNotification('Регистрация не удалась. Пожалуйста, попробуйте еще раз.', 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async handleLogout() {
        try {
            // Simulate API call
            console.log('Выход пользователя:', this.currentUser?.username);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            this.currentUser = null;
            this.clearUserFromStorage();
            this.updateUI();

            this.showNotification('Выход выполнен успешно', 'success');

            // Redirect to home page after short delay
            setTimeout(() => {
                window.location.href = '/';
            }, 500);

        } catch (error) {
            console.error('Ошибка выхода:', error);
            this.showNotification('Выход не удался', 'error');
        }
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required]');

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

     validateField(input) {
        const value = input.value.trim();
        const fieldName = input.name || input.id;

        // Clear previous error
        this.clearFieldError(input);

        // Required field validation
        if (!value) {
            this.showFieldError(input, 'Это поле обязательно для заполнения');
            return false;
        }

        // Email validation
        if (fieldName.includes('email') && !this.isValidEmail(value)) {
            this.showFieldError(input, 'Пожалуйста, введите корректный email адрес');
            return false;
        }

        // Username validation
        if (fieldName.includes('username') && value.length < 3) {
            this.showFieldError(input, 'Имя пользователя должно быть не менее 3 символов');
            return false;
        }

        // Password validation
        if (fieldName.includes('password') && value.length < 6) {
            this.showFieldError(input, 'Пароль должен быть не менее 6 символов');
            return false;
        }

        return true;
    }

    validatePasswordMatch() {
        const password = document.getElementById('reg-password');
        const confirmPassword = document.getElementById('reg-confirm-password');

        if (!password || !confirmPassword) return;

        if (confirmPassword.value && password.value !== confirmPassword.value) {
            this.showFieldError(confirmPassword, 'Пароли не совпадают');
        } else {
            this.clearFieldError(confirmPassword);
        }
    }


    updatePasswordStrength() {
        const passwordInput = document.getElementById('reg-password');
        const strengthBar = document.getElementById('password-strength');
        const strengthText = document.querySelector('.strength-text');

        if (!passwordInput || !strengthBar) return;

        const password = passwordInput.value;
        let strength = 0;
        let text = '';
        let className = '';

        if (password.length >= 6) strength += 1;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
        if (password.match(/\d/)) strength += 1;
        if (password.match(/[^a-zA-Z\d]/)) strength += 1;

        switch (strength) {
            case 0:
                text = '';
                className = '';
                break;
            case 1:
                text = 'Слабый';
                className = 'strength-weak';
                break;
            case 2:
                text = 'Средний';
                className = 'strength-medium';
                break;
            case 3:
            case 4:
                text = 'Сильный';
                className = 'strength-strong';
                break;
        }

        strengthBar.className = `strength-fill ${className}`;
        if (strengthText) {
            strengthText.textContent = text;
        }
    }

    showFieldError(input, message) {
        const field = typeof input === 'string' ? document.getElementById(input) : input;
        if (!field) return;

        field.classList.add('error');

        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }

        errorElement.textContent = message;
    }

    clearFieldError(input) {
        const field = typeof input === 'string' ? document.getElementById(input) : input;
        if (!field) return;

        field.classList.remove('error');

        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async checkAuthStatus() {
        try {
            // Check if user data exists in storage
            const userData = this.getUserFromStorage();
            if (userData) {
                this.currentUser = userData;
                this.updateUI();
                console.log('User authenticated from storage:', userData.username);
            }
        } catch (error) {
            console.error('Auth status check error:', error);
        }
    }

    saveUserToStorage(user) {
        try {
            localStorage.setItem('flowerShopUser', JSON.stringify(user));
            localStorage.setItem('flowerShopAuth', 'true');
        } catch (error) {
            console.error('Error saving user to storage:', error);
        }
    }

    getUserFromStorage() {
        try {
            const userData = localStorage.getItem('flowerShopUser');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error getting user from storage:', error);
            return null;
        }
    }

    clearUserFromStorage() {
        try {
            localStorage.removeItem('flowerShopUser');
            localStorage.removeItem('flowerShopAuth');
        } catch (error) {
            console.error('Error clearing user from storage:', error);
        }
    }

    updateUI() {
        const loginBtn = document.getElementById('login-btn');
        const userInfo = document.getElementById('user-info');
        const usernameSpan = document.getElementById('username');
        const adminPanelLink = document.getElementById('admin-panel-link');
        const mobileLoginBtn = document.getElementById('mobile-login-btn');
        const mobileUserInfo = document.getElementById('mobile-user-info');

        if (this.currentUser) {
            // User is logged in
            if (loginBtn) loginBtn.style.display = 'none';
            if (userInfo) userInfo.style.display = 'flex';
            if (usernameSpan) usernameSpan.textContent = this.currentUser.username;

            // Show admin panel link for admins
            if (adminPanelLink) {
                adminPanelLink.style.display = this.currentUser.isAdmin ? 'block' : 'none';
            }

            // Mobile menu updates
            if (mobileLoginBtn) mobileLoginBtn.style.display = 'none';
            if (mobileUserInfo) mobileUserInfo.style.display = 'block';

            console.log('UI обновлен: Пользователь вошел как', this.currentUser.username);
        } else {
            // User is not logged in
            if (loginBtn) loginBtn.style.display = 'block';
            if (userInfo) userInfo.style.display = 'none';

            // Mobile menu updates
            if (mobileLoginBtn) mobileLoginBtn.style.display = 'block';
            if (mobileUserInfo) mobileUserInfo.style.display = 'none';

            console.log('UI обновлен: Пользователь не вошел в систему');
        }
    }


    setButtonLoading(button, isLoading) {
        if (!button) return;

        if (isLoading) {
            button.disabled = true;
            button.classList.add('loading');
            const originalText = button.querySelector('.btn-text');
            if (originalText) {
                originalText.style.opacity = '0';
            }
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            const originalText = button.querySelector('.btn-text');
            if (originalText) {
                originalText.style.opacity = '1';
            }
        }
    }

    showNotification(message, type = 'info') {
        if (window.flowerShop && window.flowerShop.showNotification) {
            window.flowerShop.showNotification(message, type);
        } else {
            alert(message); // Fallback
        }
    }

    // Public methods
    isAuthenticated() {
        return this.currentUser !== null;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.isAdmin;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});