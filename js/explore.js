document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const destinationGrid = document.getElementById('destination-grid');
    
    // Sample data - in a real app, this would come from an API
    const destinations = [
        {
            id: 1,
            name: 'Sunbird Capital Hotel',
            type: 'hotel',
            description: '4-star hotel in the heart of Lilongwe',
            image: 'images/hotel.jpg',
            rating: 4.5,
            price: '$120/night'
        },
        {
            id: 2,
            name: 'Kumbali Lodge',
            type: 'lodge',
            description: 'Eco-friendly lodge with stunning views',
            image: 'images/lodge.jpg',
            rating: 4.8,
            price: '$90/night'
        },
        {
            id: 3,
            name: 'Liwonde National Park',
            type: 'attraction',
            description: 'One of Malawi\'s premier wildlife reserves',
            image: 'images/liwonde.jpg',
            rating: 4.9,
            price: '$20 entry'
        },
        // Add more destinations as needed
    ];
    
    // Load destinations
    function loadDestinations(filter = 'all') {
        destinationGrid.innerHTML = '';
        
        const filtered = filter === 'all' 
            ? destinations 
            : destinations.filter(d => d.type === filter);
            
        filtered.forEach(destination => {
            const card = document.createElement('div');
            card.className = 'destination-card';
            card.innerHTML = `
                <div class="destination-img">
                    <img src="${destination.image}" alt="${destination.name}">
                </div>
                <div class="destination-content">
                    <h3>${destination.name}</h3>
                    <div class="destination-rating">
                        ${'★'.repeat(Math.floor(destination.rating))}${'☆'.repeat(5 - Math.floor(destination.rating))}
                    </div>
                    <p>${destination.description}</p>
                    <div class="destination-price">${destination.price}</div>
                    <button class="btn btn-outline view-details" data-id="${destination.id}">View Details</button>
                </div>
            `;
            destinationGrid.appendChild(card);
        });
        
        // Add event listeners to view buttons
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                const destination = destinations.find(d => d.id == id);
                // In a real app, this would navigate to a details page
                alert(`Viewing details for ${destination.name}`);
            });
        });
    }
    
    // Filter button events
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            loadDestinations(this.dataset.filter);
        });
    });
    
    // Initial load
    loadDestinations();
});