import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'You are not authorised to access this page',
        });
    }
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token has expired',
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token',
                });
            }
        }
        req.user = user;
        next();
    });
};
export const verifyUser = (req, res, next) => {
    if (req.user.id === req.params.id || req.user.role === 'admin') {
        next();
    } else {
        return res.status(401).json({
            success: false,
            message: 'You are not authenticated',
        });
    }
};

export const verifyAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        next();
    } else {
        return res.status(401).json({
            success: false,
            message: 'You are not authorized',
        });
    }
};
