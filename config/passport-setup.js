const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models'); 
 
module.exports = function(passport) {
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            try {
                const user = await User.findOne({ where: { Username: username } });

                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                
                if (password !== user.Password) {
                    return done(null, false, { message: 'Incorrect password.' });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.Id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findByPk(id);
            //console.log("Deserialized user:", user);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
        
    
};