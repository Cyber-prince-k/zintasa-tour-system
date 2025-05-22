const express = require('express');
const Location = require('../models/Location');
const router = express.Router();

// Get all locations
router.get('/', async (req, res) => {
    try {
        const { type, near } = req.query;
        
        let query = {};
        if (type) query.type = type;
        
        let locations;
        if (near) {
            const [lat, lng, radius] = near.split(',');
            locations = await Location.find({
                ...query,
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(lng), parseFloat(lat)]
                        },
                        $maxDistance: parseInt(radius) || 10000
                    }
                }
            });
        } else {
            locations = await Location.find(query);
        }
        
        res.json(locations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get location by ID
router.get('/:id', async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }
        
        res.json(location);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;