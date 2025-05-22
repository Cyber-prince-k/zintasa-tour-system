/* document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let map;
    let userLocation;
    let markers = [];
    let currentUser = null;
    let socket = null;
    let currentChat = null;
    
    // DOM Elements
    const authModal = document.getElementById('auth-modal');
    const bookingModal = document.getElementById('booking-modal');
    const chatModal = document.getElementById('chat-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const bookingForm = document.getElementById('booking-form');
    const chatMessages = document.getElementById('chat-messages');
    const chatMessageInput = document.getElementById('chat-message');
    const sendMessageBtn = document.getElementById('send-message');
    const shareLocationBtn = document.getElementById('share-location');
    const negotiatePriceBtn = document.getElementById('negotiate-price');
    const locationInfo = document.getElementById('location-info');
    const infoTitle = document.getElementById('info-title');
    const infoContent = document.getElementById('info-content');
    const bookNowBtn = document.getElementById('book-now-btn');
    const chatBtn = document.getElementById('chat-btn');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const closeLocationInfo = document.querySelector('.location-info .close-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const categoryCards = document.querySelectorAll('.category-card');
    const searchBox = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-box button');
    const featuredGrid = document.querySelector('.featured-grid');

    // Initialize the map
    function initMap() {
        // Default to Lilongwe coordinates if user location not available
        const defaultCoords = [-13.9626, 33.7741];
        
        map = L.map('map').setView(defaultCoords, 10);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Try to get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    userLocation = [position.coords.latitude, position.coords.longitude];
                    map.setView(userLocation, 13);
                    
                    // Add user location marker
                    L.marker(userLocation, {
                        icon: L.divIcon({
                            className: 'user-location-marker',
                            html: '<i class="fas fa-map-marker-alt" style="color: #2a5a78; font-size: 32px;"></i>',
                            iconSize: [32, 32],
                            iconAnchor: [16, 32]
                        })
                    }).addTo(map).bindPopup('Your location').openPopup();
                    
                    // Load nearby locations
                    loadNearbyLocations();
                },
                error => {
                    console.error('Error getting location:', error);
                    userLocation = defaultCoords;
                    loadNearbyLocations();
                }
            );
        } else {
            console.log('Geolocation is not supported by this browser.');
            userLocation = defaultCoords;
            loadNearbyLocations();
        }
    }
    
    // Load nearby locations from server
    function loadNearbyLocations() {
        // In a real app, this would be an API call to your backend
        // For demo purposes, we'll use mock data
        
        const mockLocations = [
            {
                id: 1,
                name: 'Sunbird Capital Hotel',
                type: 'hotel',
                coords: [-13.9833, 33.7833],
                description: '4-star hotel in the heart of Lilongwe',
                rating: 4.5,
                price: '$120/night',
                amenities: ['Pool', 'WiFi', 'Restaurant', 'Spa'],
                contact: '+265 123 456 789'
            },
            {
                id: 2,
                name: 'Kumbali Lodge',
                type: 'lodge',
                coords: [-14.0167, 33.7667],
                description: 'Eco-friendly lodge with stunning views',
                rating: 4.8,
                price: '$90/night',
                amenities: ['WiFi', 'Restaurant', 'Nature Walks'],
                contact: '+265 987 654 321'
            },
            {
                id: 3,
                name: 'Liwonde National Park',
                type: 'attraction',
                coords: [-14.8333, 35.3333],
                description: 'One of Malawi\'s premier wildlife reserves',
                rating: 4.9,
                activities: ['Game Drives', 'Boat Safaris', 'Bird Watching'],
                contact: '+265 111 222 333'
            },
            {
                id: 4,
                name: 'Lake Malawi',
                type: 'attraction',
                coords: [-12.5, 34.5],
                description: 'The Lake of Stars with pristine beaches',
                rating: 5.0,
                activities: ['Swimming', 'Snorkeling', 'Kayaking', 'Relaxing'],
                contact: '+265 444 555 666'
            },
            {
                id: 5,
                name: 'John Taxi Services',
                type: 'taxi',
                coords: [-13.9733, 33.7833],
                description: 'Reliable taxi service in Lilongwe',
                rating: 4.2,
                price: '$0.50/km',
                vehicles: ['Sedan', 'Minivan'],
                contact: '+265 777 888 999'
            }
        ];
        
        // Clear existing markers
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
        
        // Add markers to map
        mockLocations.forEach(location => {
            let iconColor;
            let iconClass;
            
            switch(location.type) {
                case 'hotel':
                    iconColor = '#d63031';
                    iconClass = 'fas fa-hotel';
                    break;
                case 'lodge':
                    iconColor = '#00b894';
                    iconClass = 'fas fa-campground';
                    break;
                case 'attraction':
                    iconColor = '#0984e3';
                    iconClass = 'fas fa-mountain';
                    break;
                case 'taxi':
                    iconColor = '#fdcb6e';
                    iconClass = 'fas fa-taxi';
                    break;
                default:
                    iconColor = '#6c5ce7';
                    iconClass = 'fas fa-map-marker-alt';
            }
            
            const marker = L.marker(location.coords, {
                icon: L.divIcon({
                    className: 'location-marker',
                    html: `<i class="${iconClass}" style="color: ${iconColor}; font-size: 24px;"></i>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 24]
                })
            }).addTo(map);
            
            marker.on('click', () => showLocationInfo(location));
            markers.push(marker);
            
            // Store location data with marker
            marker.locationData = location;
        });
        
        // Populate featured section
        populateFeatured(mockLocations.filter(loc => ['hotel', 'lodge', 'attraction'].includes(loc.type)));
    }
    
    // Show location information panel
    function showLocationInfo(location) {
        infoTitle.textContent = location.name;
        
        let html = `<p><strong>Description:</strong> ${location.description}</p>`;
        html += `<p><strong>Rating:</strong> ${'★'.repeat(Math.floor(location.rating))}${'☆'.repeat(5 - Math.floor(location.rating))} (${location.rating})</p>`;
        
        if (location.type === 'hotel' || location.type === 'lodge') {
            html += `<p><strong>Price:</strong> ${location.price}</p>`;
            html += `<p><strong>Amenities:</strong> ${location.amenities.join(', ')}</p>`;
        } else if (location.type === 'attraction') {
            html += `<p><strong>Activities:</strong> ${location.activities.join(', ')}</p>`;
        } else if (location.type === 'taxi') {
            html += `<p><strong>Price:</strong> ${location.price}</p>`;
            html += `<p><strong>Vehicles:</strong> ${location.vehicles.join(', ')}</p>`;
        }
        
        html += `<p><strong>Contact:</strong> ${location.contact}</p>`;
        
        infoContent.innerHTML = html;
        
        // Show appropriate buttons
        if (location.type === 'taxi') {
            bookNowBtn.style.display = 'none';
            chatBtn.style.display = 'block';
        } else {
            bookNowBtn.style.display = 'block';
            chatBtn.style.display = 'none';
        }
        
        // Store current location
        infoContent.currentLocation = location;
        
        locationInfo.style.display = 'block';
    }
    
    // Populate featured section
    function populateFeatured(locations) {
        featuredGrid.innerHTML = '';
        
        locations.slice(0, 3).forEach(location => {
            const item = document.createElement('div');
            item.className = 'featured-item';
            item.dataset.id = location.id;
            
            let imgSrc = '';
            if (location.type === 'hotel') imgSrc = 'images/hotel.jpg';
            else if (location.type === 'lodge') imgSrc = 'images/lodge.jpg';
            else if (location.type === 'attraction') imgSrc = 'images/attraction.jpg';
            
            item.innerHTML = `
                <div class="featured-img">
                    <img src="${imgSrc}" alt="${location.name}">
                </div>
                <div class="featured-content">
                    <h3>${location.name}</h3>
                    <div class="featured-rating">
                        ${'★'.repeat(Math.floor(location.rating))}${'☆'.repeat(5 - Math.floor(location.rating))}
                    </div>
                    <p>${location.description}</p>
                    ${location.price ? `<div class="featured-price">${location.price}</div>` : ''}
                    <button class="btn btn-outline view-btn" style="margin-top: 10px;">View Details</button>
                </div>
            `;
            
            featuredGrid.appendChild(item);
            
            // Add click event to view button
            item.querySelector('.view-btn').addEventListener('click', () => {
                showLocationInfo(location);
                locationInfo.style.display = 'block';
            });
        });
    }
    
    // Initialize authentication modal
    function initAuthModal() {
        loginBtn.addEventListener('click', () => {
            authModal.classList.add('active');
            document.querySelector('.auth-tabs .tab-btn[data-tab="login"]').click();
        });
        
        registerBtn.addEventListener('click', () => {
            authModal.classList.add('active');
            document.querySelector('.auth-tabs .tab-btn[data-tab="register"]').click();
        });
        
        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                
                // Update active tab
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Show corresponding form
                document.querySelectorAll('.auth-form').forEach(form => {
                    form.classList.remove('active');
                });
                document.getElementById(`${tab}-form`).classList.add('active');
            });
        });
        
        // Form submissions
        loginForm.addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // In a real app, this would be an API call to your backend
            console.log('Login attempt:', email, password);
            
            // Mock login
            currentUser = {
                id: 1,
                name: 'Test User',
                email: email,
                role: 'tourist'
            };
            
            // Connect to socket
            connectSocket();
            
            // Close modal and update UI
            authModal.classList.remove('active');
            updateAuthUI();
            
            // Show success message
            alert('Login successful!');
        });
        
        registerForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const role = document.getElementById('register-role').value;
            
            // In a real app, this would be an API call to your backend
            console.log('Registration attempt:', name, email, password, role);
            
            // Mock registration
            currentUser = {
                id: 2,
                name: name,
                email: email,
                role: role
            };
            
            // Connect to socket
            connectSocket();
            
            // Close modal and update UI
            authModal.classList.remove('active');
            updateAuthUI();
            
            // Show success message
            alert('Registration successful!');
        });
    }
    
    // Connect to socket.io server
    function connectSocket() {
        if (socket) socket.disconnect();
        
        // In a real app, this would connect to your backend
        // socket = io('http://your-backend-url');
        
        console.log('Connecting to socket server...');
        
        // Mock socket behavior for demo
        socket = {
            on: (event, callback) => {
                console.log(`Socket listening for ${event}`);
                if (event === 'chatMessage') {
                    // Mock receiving a message
                    setTimeout(() => {
                        if (currentChat) {
                            callback({
                                sender: currentChat.id,
                                message: 'Hello! How can I help you?',
                                timestamp: new Date()
                            });
                        }
                    }, 1000);
                }
            },
            emit: (event, data) => {
                console.log(`Socket emitting ${event}`, data);
            },
            disconnect: () => {
                console.log('Socket disconnected');
            }
        };
    }
    
    // Update UI based on authentication state
    function updateAuthUI() {
        if (currentUser) {
            document.querySelector('.auth-buttons').style.display = 'none';
            document.querySelector('nav ul li:nth-child(3)').style.display = 'block';
            document.querySelector('nav ul li:nth-child(4)').style.display = 'block';
            document.querySelector('nav ul li:nth-child(5)').textContent = currentUser.name;
        } else {
            document.querySelector('.auth-buttons').style.display = 'flex';
            document.querySelector('nav ul li:nth-child(3)').style.display = 'none';
            document.querySelector('nav ul li:nth-child(4)').style.display = 'none';
            document.querySelector('nav ul li:nth-child(5)').textContent = 'Account';
        }
    }
    
    // Initialize booking modal
    function initBookingModal() {
        bookNowBtn.addEventListener('click', () => {
            if (!currentUser) {
                alert('Please login to book services');
                authModal.classList.add('active');
                return;
            }
            
            const location = infoContent.currentLocation;
            document.getElementById('booking-service').value = location.name;
            bookingModal.classList.add('active');
        });
        
        bookingForm.addEventListener('submit', e => {
            e.preventDefault();
            
            const service = document.getElementById('booking-service').value;
            const name = document.getElementById('booking-name').value;
            const email = document.getElementById('booking-email').value;
            const phone = document.getElementById('booking-phone').value;
            const date = document.getElementById('booking-date').value;
            const notes = document.getElementById('booking-notes').value;
            
            // In a real app, this would be an API call to your backend
            console.log('Booking submitted:', { service, name, email, phone, date, notes });
            
            // Close modal and show success message
            bookingModal.classList.remove('active');
            alert('Booking successful! You will receive a confirmation email shortly.');
            
            // Reset form
            bookingForm.reset();
        });
    }
    
    // Initialize chat modal
    function initChatModal() {
        chatBtn.addEventListener('click', () => {
            if (!currentUser) {
                alert('Please login to chat with service providers');
                authModal.classList.add('active');
                return;
            }
            
            const location = infoContent.currentLocation;
            currentChat = {
                id: location.id,
                name: location.name,
                type: location.type
            };
            
            document.getElementById('chat-title').textContent = `Chat with ${location.name}`;
            chatMessages.innerHTML = '';
            
            // In a real app, this would load previous messages from the server
            // For demo, we'll just show a welcome message
            addMessage('system', 'You are now connected with ' + location.name);
            
            chatModal.classList.add('active');
        });
        
        // Send message
        sendMessageBtn.addEventListener('click', sendMessage);
        chatMessageInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') sendMessage();
        });
        
        // Share location
        shareLocationBtn.addEventListener('click', () => {
            if (!userLocation) {
                alert('Location not available');
                return;
            }
            
            // In a real app, this would send the location to the taxi driver via socket
            addMessage('sent', 'I have shared my location with you');
            
            // Show map with location
            const mapUrl = `https://www.openstreetmap.org/?mlat=${userLocation[0]}&mlon=${userLocation[1]}#map=16/${userLocation[0]}/${userLocation[1]}`;
            addMessage('received', `Location received: <a href="${mapUrl}" target="_blank">View on Map</a>`);
            
            alert('Location shared successfully!');
        });
        
        // Negotiate price
        negotiatePriceBtn.addEventListener('click', () => {
            const newPrice = prompt('Enter your proposed price:');
            if (newPrice) {
                addMessage('sent', `I would like to negotiate the price to ${newPrice}`);
                
                // Mock response
                setTimeout(() => {
                    addMessage('received', `We can offer you a price of ${newPrice} for this trip. Is that acceptable?`);
                }, 1000);
            }
        });
    }
    
    // Send chat message
    function sendMessage() {
        const message = chatMessageInput.value.trim();
        if (!message) return;
        
        // Add to chat UI
        addMessage('sent', message);
        
        // In a real app, this would send the message via socket
        socket.emit('chatMessage', {
            recipient: currentChat.id,
            message: message,
            timestamp: new Date()
        });
        
        // Clear input
        chatMessageInput.value = '';
    }
    
    // Add message to chat UI
    function addMessage(type, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Initialize filter buttons
    function initFilters() {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter markers
                markers.forEach(marker => {
                    if (filter === 'all' || marker.locationData.type === filter) {
                        marker.addTo(map);
                    } else {
                        map.removeLayer(marker);
                    }
                });
            });
        });
        
        // Category cards also act as filters
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const filter = card.dataset.filter;
                document.querySelector(`.filter-btn[data-filter="${filter}"]`).click();
                
                // Scroll to map
                document.getElementById('map-section').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }
    
    // Initialize search functionality
    function initSearch() {
        searchBtn.addEventListener('click', performSearch);
        searchBox.addEventListener('keypress', e => {
            if (e.key === 'Enter') performSearch();
        });
    }
    
    function performSearch() {
        const query = searchBox.value.trim().toLowerCase();
        if (!query) return;
        
        // In a real app, this would be an API call to your backend
        // For demo, we'll filter our mock data
        markers.forEach(marker => {
            if (marker.locationData.name.toLowerCase().includes(query) || 
                marker.locationData.description.toLowerCase().includes(query)) {
                marker.addTo(map);
                map.setView(marker.getLatLng(), 13);
                marker.openPopup();
            } else {
                map.removeLayer(marker);
            }
        });
    }
    
    // Initialize modal close buttons
    function initModalClosers() {
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.modal.active').classList.remove('active');
            });
        });
        
        closeLocationInfo.addEventListener('click', () => {
            locationInfo.style.display = 'none';
        });
        
        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', e => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }
    
    // Initialize the app
    function init() {
        initMap();
        initAuthModal();
        initBookingModal();
        initChatModal();
        initFilters();
        initSearch();
        initModalClosers();
        
        // For demo, hide bookings and chat links initially
        document.querySelector('nav ul li:nth-child(3)').style.display = 'none';
        document.querySelector('nav ul li:nth-child(4)').style.display = 'none';
    }
    
    // Start the app
    init();
}); */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let map;
    let userLocation;
    let markers = [];
    let currentUser = null;
    let socket = null;
    let currentChat = null;
    
    // API endpoints (replace with your actual API endpoints)
    const API = {
        locations: 'https://your-api.com/api/locations',
        transport: 'https://your-api.com/api/transport',
        featured: 'https://your-api.com/api/featured',
        bookings: 'https://your-api.com/api/bookings',
        chat: 'wss://your-api.com/chat'
    };
    
    // Initialize the map with transport services
    function initMap() {
        // Default to Lilongwe coordinates
        const defaultCoords = [-13.9626, 33.7741];
        
        map = L.map('map').setView(defaultCoords, 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Try to get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    userLocation = [position.coords.latitude, position.coords.longitude];
                    map.setView(userLocation, 13);
                    
                    // Add user location marker
                    L.marker(userLocation, {
                        icon: L.divIcon({
                            className: 'user-location-marker',
                            html: '<i class="fas fa-map-marker-alt" style="color: #2a5a78; font-size: 32px;"></i>',
                            iconSize: [32, 32],
                            iconAnchor: [16, 32]
                        })
                    }).addTo(map).bindPopup('Your location').openPopup();
                    
                    // Load nearby locations and transport
                    loadNearbyLocations();
                    loadTransportServices();
                },
                error => {
                    console.error('Error getting location:', error);
                    userLocation = defaultCoords;
                    loadNearbyLocations();
                    loadTransportServices();
                }
            );
        } else {
            console.log('Geolocation is not supported by this browser.');
            userLocation = defaultCoords;
            loadNearbyLocations();
            loadTransportServices();
        }
    }
    
    // Load nearby locations from API
    async function loadNearbyLocations(filter = 'all') {
        try {
            const response = await fetch(`${API.locations}?lat=${userLocation[0]}&lng=${userLocation[1]}&filter=${filter}`);
            const locations = await response.json();
            
            // Clear existing markers
            markers.forEach(marker => map.removeLayer(marker));
            markers = [];
            
            // Add markers to map
            locations.forEach(location => {
                addLocationMarker(location);
            });
            
            // Load featured locations
            loadFeaturedLocations();
        } catch (error) {
            console.error('Error loading locations:', error);
        }
    }
    
    // Load transport services from API
    async function loadTransportServices() {
        try {
            const response = await fetch(`${API.transport}?lat=${userLocation[0]}&lng=${userLocation[1]}`);
            const transportServices = await response.json();
            
            transportServices.forEach(service => {
                addTransportMarker(service);
            });
        } catch (error) {
            console.error('Error loading transport services:', error);
        }
    }
    
    // Add a location marker to the map
    function addLocationMarker(location) {
        let iconColor, iconClass;
        
        switch(location.type) {
            case 'hotel':
                iconColor = '#d63031';
                iconClass = 'fas fa-hotel';
                break;
            case 'lodge':
                iconColor = '#00b894';
                iconClass = 'fas fa-campground';
                break;
            case 'attraction':
                iconColor = '#0984e3';
                iconClass = 'fas fa-mountain';
                break;
            default:
                iconColor = '#6c5ce7';
                iconClass = 'fas fa-map-marker-alt';
        }
        
        const marker = L.marker([location.latitude, location.longitude], {
            icon: L.divIcon({
                className: 'location-marker',
                html: `<i class="${iconClass}" style="color: ${iconColor}; font-size: 24px;"></i>`,
                iconSize: [24, 24],
                iconAnchor: [12, 24]
            })
        }).addTo(map);
        
        marker.on('click', () => showLocationInfo(location));
        markers.push(marker);
        marker.locationData = location;
    }
    
    // Add a transport service marker to the map
    function addTransportMarker(service) {
        let iconColor, iconClass;
        
        switch(service.type) {
            case 'taxi':
                iconColor = '#fdcb6e';
                iconClass = 'fas fa-taxi';
                break;
            case 'motorcycle':
                iconColor = '#e17055';
                iconClass = 'fas fa-motorcycle';
                break;
            case 'minibus':
                iconColor = '#00cec9';
                iconClass = 'fas fa-bus';
                break;
            default:
                iconColor = '#636e72';
                iconClass = 'fas fa-car';
        }
        
        const marker = L.marker([service.latitude, service.longitude], {
            icon: L.divIcon({
                className: 'transport-marker',
                html: `<i class="${iconClass}" style="color: ${iconColor}; font-size: 24px;"></i>`,
                iconSize: [24, 24],
                iconAnchor: [12, 24]
            })
        }).addTo(map);
        
        marker.on('click', () => showTransportInfo(service));
        markers.push(marker);
        marker.transportData = service;
    }
    
    // Show location information
    function showLocationInfo(location) {
        infoTitle.textContent = location.name;
        
        let html = `<p><strong>Description:</strong> ${location.description}</p>`;
        html += `<p><strong>Rating:</strong> ${'★'.repeat(Math.floor(location.rating))}${'☆'.repeat(5 - Math.floor(location.rating))} (${location.rating})</p>`;
        
        if (location.type === 'hotel' || location.type === 'lodge') {
            html += `<p><strong>Price:</strong> ${location.price}</p>`;
            html += `<p><strong>Amenities:</strong> ${location.amenities.join(', ')}</p>`;
        } else if (location.type === 'attraction') {
            html += `<p><strong>Activities:</strong> ${location.activities.join(', ')}</p>`;
        }
        
        html += `<p><strong>Contact:</strong> ${location.contact}</p>`;
        
        infoContent.innerHTML = html;
        bookNowBtn.style.display = 'block';
        chatBtn.style.display = 'none';
        infoContent.currentLocation = location;
        locationInfo.style.display = 'block';
    }
    
    // Show transport service information
    function showTransportInfo(service) {
        infoTitle.textContent = `${service.driverName}'s ${service.type}`;
        
        let html = `<p><strong>Vehicle:</strong> ${service.vehicleModel} (${service.licensePlate})</p>`;
        html += `<p><strong>Price:</strong> ${service.pricePerKm}/km</p>`;
        html += `<p><strong>Rating:</strong> ${'★'.repeat(Math.floor(service.rating))}${'☆'.repeat(5 - Math.floor(service.rating))} (${service.rating})</p>`;
        html += `<p><strong>Status:</strong> ${service.available ? 'Available' : 'Unavailable'}</p>`;
        html += `<p><strong>Contact:</strong> ${service.contact}</p>`;
        
        infoContent.innerHTML = html;
        bookNowBtn.style.display = 'none';
        chatBtn.style.display = 'block';
        infoContent.currentTransport = service;
        locationInfo.style.display = 'block';
    }
    
    // Load featured locations from API
    async function loadFeaturedLocations() {
        try {
            const response = await fetch(API.featured);
            const featured = await response.json();
            populateFeatured(featured);
        } catch (error) {
            console.error('Error loading featured locations:', error);
        }
    }
    
    // Populate featured section
    function populateFeatured(locations) {
        const featuredGrid = document.getElementById('featured-grid');
        featuredGrid.innerHTML = '';
        
        locations.slice(0, 3).forEach(location => {
            const item = document.createElement('div');
            item.className = 'featured-item';
            item.innerHTML = `
                <div class="featured-img">
                    <img src="${location.image || 'images/default-location.jpg'}" alt="${location.name}">
                </div>
                <div class="featured-content">
                    <h3>${location.name}</h3>
                    <div class="featured-rating">
                        ${'★'.repeat(Math.floor(location.rating))}${'☆'.repeat(5 - Math.floor(location.rating))}
                    </div>
                    <p>${location.description}</p>
                    ${location.price ? `<div class="featured-price">${location.price}</div>` : ''}
                    <button class="btn btn-outline view-btn">View Details</button>
                </div>
            `;
            
            featuredGrid.appendChild(item);
            
            item.querySelector('.view-btn').addEventListener('click', () => {
                // Find the marker for this location and open its popup
                const marker = markers.find(m => 
                    m.locationData && m.locationData.id === location.id
                );
                if (marker) {
                    map.setView(marker.getLatLng(), 15);
                    marker.openPopup();
                }
            });
        });
    }
    
    // Initialize other functionality (auth, bookings, chat, etc.)
    // ... (rest of your existing app.js code)
    
    // Initialize the app
    initMap();
    initAuthModal();
    initBookingModal();
    initChatModal();
    initFilters();
    initSearch();
    initModalClosers();
});