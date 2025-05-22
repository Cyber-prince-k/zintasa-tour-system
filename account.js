document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabLinks = document.querySelectorAll('.account-menu a[data-tab]');
    const tabs = document.querySelectorAll('.account-tab');
    
    // Sample user data - in a real app, this would come from an API
    const user = {
        id: 1,
        name: 'John Tourist',
        email: 'john@example.com',
        phone: '+265123456789',
        role: 'tourist',
        avatar: 'images/default-avatar.jpg'
    };
    
    // Load user data
    function loadUserData() {
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-role').textContent = user.role === 'tourist' ? 'Tourist' : 'Taxi Driver';
        document.getElementById('profile-img').src = user.avatar;
        document.getElementById('full-name').value = user.name;
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = user.phone;
    }
    
    // Tab switching
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.dataset.tab + '-tab';
            
            tabLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            tabs.forEach(tab => tab.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Form submissions
    document.getElementById('profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real app, this would call an API to update the profile
        user.name = document.getElementById('full-name').value;
        user.email = document.getElementById('email').value;
        user.phone = document.getElementById('phone').value;
        
        document.getElementById('user-name').textContent = user.name;
        alert('Profile updated successfully!');
    });
    
    document.getElementById('security-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        
        // In a real app, this would validate current password and update via API
        alert('Password changed successfully!');
        this.reset();
    });
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            // In a real app, this would clear authentication tokens
            window.location.href = 'index.html';
        }
    });
    
    // Initial load
    loadUserData();
});