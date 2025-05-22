const express = require('express');
const auth = require('../middleware/auth');
const Taxi = require('../models/Taxi');
const router = express.Router();

// Get nearby taxis
router.get('/nearby', async (req, res) => {
    try {
        const { lat, lng, radius } = req.query;
        
        if (!lat || !lng) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }
        
        const taxis = await Taxi.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius) || 5000
                }
            },
            available: true
        });
        
        res.json(taxis);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update taxi availability
router.put('/:id/availability', auth, async (req, res) => {
    try {
        const { available } = req.body;
        
        // Check if user is a taxi driver
        if (req.user.role !== 'taxi') {
            return res.status(401).json({ message: 'Not authorized' });
        }
        
        const taxi = await Taxi.findByIdAndUpdate(
            req.params.id,
            { available },
            { new: true }
        );
        
        res.json(taxi);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;