const express = require('express');
const router = express.Router();
const passport = require('passport');
const { User } = require('../models');

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.user); // Log the user object
  res.render('index', { title: 'Express'});
});

router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Express'});
});

router.post('/login/password', passport.authenticate('local', {
  successRedirect: '/vehicles',
  failureRedirect: '/login'
}));
 
router.get('/logout', function(req, res) {
  req.logout(function(error) {
      if (error) { return next(err); }
      res.redirect('/');
  });
});

router.get('/signup', (req, res, next) => {
  res.render('signup', { title: 'Express'});
});

router.post('/signup', async (req, res) => {
  const { username, password, firstname, lastname } = req.body;
  const fullName = `${firstname} ${lastname}`;
  const defaultRoleId = 2; 

  try {
    const newUser = await User.create({
        FullName: fullName,
        Username: username,
        Password: password,
        RoleId: defaultRoleId
    });

    // Auto-login the user after signup
    req.login(newUser, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.redirect('/vehicles');
    });
  } catch (error) {
    res.render('signup', { error: 'Error creating account' });
  }
});

module.exports = router;