var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../middleware/authentication');
const { isCustomer, isAdmin } = require('../middleware/authorization');
const TypeService = require('../services/TypeService'); 
const db = require('../models'); 
const typeService = new TypeService(db);

router.get('/', ensureAuthenticated, isAdmin, async function (req, res, next) {
    try {
        const types = await typeService.getAllVehicleTypes();
        res.render("types", { user: req.user, types: types });
    } catch (error) {
        console.error('Error in route:', error);
        res.status(500).send({ message: error.message });
    }
});

router.post('/add', ensureAuthenticated, isAdmin, async function (req, res) {
    try {
        const { name } = req.body;
        await typeService.addVehicleType(name);
        res.redirect('/types'); 
    } catch (error) {
        console.error('Error adding vehicle type:', error);
        res.status(500).send({ message: error.message });
    }
});


router.post('/update', ensureAuthenticated, isAdmin, async function (req, res) {
    const { typeId , newName  } = req.body; 
    try {
        await typeService.updateVehicleType(typeId, newName );
        res.redirect('/types'); // Redirect back to the types page
    } catch (error) {
        console.error('Error updating vehicle type:', error);
        res.status(500).send({ message: error.message });
    }
});

router.post('/delete', ensureAuthenticated, isAdmin, async function (req, res) {
    const { typeId } = req.body; 
    try {
        await typeService.deleteVehicleType(typeId);
        res.redirect('/types'); 
    } catch (error) {
        console.error('Error deleting vehicle type:', error);
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;