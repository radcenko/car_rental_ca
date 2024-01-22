const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authentication');
const { isCustomer, isAdmin } = require('../middleware/authorization');
const VehicleService = require('../services/VehicleService'); 
const db = require('../models'); 
const vehicleService = new VehicleService(db);

// GET Route for Display vehicles based on filter or if no filter applied - all vehicles
router.get('/', async (req, res) => {
  try {
      let vehicles;
      switch(req.query.sort) {
          case 'popular':
              vehicles = await vehicleService.getPopularVehicleTypes();
              break;
          case 'rented':
              vehicles = await vehicleService.getCurrentlyRentedVehicles();
              break;
          case 'serviceable':
              // Ensure the user is authenticated and is an admin
              if (req.isAuthenticated && req.user && req.user.RoleId === 1) { 
                  vehicles = await vehicleService.getVehiclesRequiringService();
              } else {
                  // Error message for unauthorized access
                  return res.status(403).send('Access denied');
              }
              break;
          case 'cruiseControl':
              vehicles = await vehicleService.getVehiclesWithCruiseControl();
              break;
          default:
              vehicles = await vehicleService.getAllVehicles();
      }
      res.render('vehicles', { user: req.user, vehicles: vehicles, sort: req.query.sort });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ message: error.message });
  }
});

// POST Route for Renting a Vehicle - logged-in users only
router.post('/', ensureAuthenticated, isCustomer, async (req, res) => {
  const { userId, vehicleId, rentalStartDate, rentalEndDate } = req.body;
  try {
    await vehicleService.rentVehicle(userId, vehicleId, rentalStartDate, rentalEndDate);
    res.redirect('/vehicles');
  } catch (error) {
    console.error('Error renting vehicle:', error);
    res.status(500).send({ message: error.message });
  }
});

// DELETE Route for Canceling a Rental - accessible by admins only
router.delete('/cancel/:vehicleId', ensureAuthenticated, isAdmin, async (req, res) => {
  const { vehicleId } = req.params;
  try {
    await vehicleService.cancelRental(vehicleId);
    res.send('Rental cancelled successfully');
  } catch (error) {
    console.error('Error cancelling rental:', error);
    res.status(500).send('Unable to cancel rental');
  }
});

module.exports = router;
