document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const bookingsGrid = document.getElementById('bookings-grid');
    
    // Sample data - in a real app, this would come from an API
    const bookings = [
        {
            id: 1,
            serviceName: 'Sunbird Capital Hotel',
            serviceType: 'hotel',
            date: '2023-12-15',
            status: 'confirmed',
            price: '$120'
        },
        {
            id: 2,
            serviceName: 'Liwonde National Park Tour',
            serviceType: 'attraction',
            date: '2023-12-20',
            status: 'pending',
            price: '$50'
        },
        // Add more bookings as needed
    ];
    
    // Load bookings
    function loadBookings(filter = 'upcoming') {
        bookingsGrid.innerHTML = '';
        
        if (bookings.length === 0) {
            document.querySelector('.no-bookings').style.display = 'block';
            return;
        }
        
        document.querySelector('.no-bookings').style.display = 'none';
        
        const filtered = bookings.filter(booking => {
            if (filter === 'upcoming') return booking.status !== 'cancelled';
            if (filter === 'past') return false; // In a real app, this would filter past bookings
            return booking.status === filter;
        });
        
        filtered.forEach(booking => {
            const card = document.createElement('div');
            card.className = 'booking-card';
            card.innerHTML = `
                <h3>${booking.serviceName}</h3>
                <div class="booking-meta">
                    <span>${new Date(booking.date).toLocaleDateString()}</span>
                    <span>${booking.price}</span>
                </div>
                <div class="booking-status ${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</div>
                <div class="booking-actions">
                    <button class="btn btn-outline view-details" data-id="${booking.id}">Details</button>
                    ${booking.status === 'pending' ? '<button class="btn btn-danger cancel-booking" data-id="${booking.id}">Cancel</button>' : ''}
                </div>
            `;
            bookingsGrid.appendChild(card);
        });
        
        // Add event listeners
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                const booking = bookings.find(b => b.id == id);
                alert(`Booking details for ${booking.serviceName}`);
            });
        });
        
        document.querySelectorAll('.cancel-booking').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                if (confirm('Are you sure you want to cancel this booking?')) {
                    // In a real app, this would call an API
                    alert('Booking cancelled');
                    loadBookings(filter);
                }
            });
        });
    }
    
    // Tab button events
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            loadBookings(this.dataset.tab);
        });
    });
    
    // Initial load
    loadBookings();
});