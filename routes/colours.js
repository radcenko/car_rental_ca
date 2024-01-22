var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../middleware/authentication');
const { isCustomer, isAdmin } = require('../middleware/authorization');
const ColourService = require('../services/ColourService'); 
const db = require('../models'); 
const colourService = new ColourService(db);

router.get('/', ensureAuthenticated, isAdmin, async function (req, res, next) {
    try {
        const colours = await colourService.getAllVehicleColours();
        res.render("colours", { user: req.user, colours: colours });
    } catch (error) {
        console.error('Error in route:', error);
        res.status(500).send({ message: error.message });
    }
});

router.post('/add', ensureAuthenticated, isAdmin, async function (req, res) {
    const { colourName } = req.body;
    try {
        await colourService.addVehicleColour(colourName);
        res.redirect('/colours');
    } catch (error) {
        console.error('Error adding colour:', error);
        res.status(500).send({ message: error.message });
    }
});

router.post('/update', ensureAuthenticated, isAdmin, async function (req, res) {
    const { id, newColour } = req.body;
    try {
        await colourService.updateVehicleColour(id, newColour);
        res.redirect('/colours'); 
    } catch (error) {
        console.error('Error updating colour:', error);
        res.status(500).send({ message: error.message });
    }
});

router.post('/delete', ensureAuthenticated, isAdmin, async function (req, res) {
    const { id } = req.body;
    try {
        await colourService.deleteVehicleColour(id);
        res.redirect('/colours');
    } catch (error) {
        console.error('Error deleting colour:', error);
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;