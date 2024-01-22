function isCustomer(req, res, next) {
    if (req.user && req.user.RoleId === 2) {
        return next();
    } else {
        res.status(403).redirect('/error?message=Permission denied. Only logged in customers can access this resource.');
    }
}
 
function isAdmin(req, res, next) {
    if (req.user && req.user.RoleId === 1) {
        return next();
    } else {
        res.status(403).redirect('/error?message=Permission denied. Only admins can access this resource.');
    }
}

module.exports = {
    isCustomer,
    isAdmin
};