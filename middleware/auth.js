function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
}

function requireAdmin(req, res, next) {
    if (!req.session.userId || !req.session.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

function optionalAuth(req, res, next) {
    if (req.session.userId) {
        req.user = {
            id: req.session.userId,
            username: req.session.username,
            isAdmin: req.session.isAdmin
        };
    }
    next();
}

module.exports = {
    requireAuth,
    requireAdmin,
    optionalAuth
};