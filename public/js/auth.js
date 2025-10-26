class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        console.log('Auth manager initialized');
        // Basic auth functionality will be added later
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});
