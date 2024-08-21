const User = require("../models/userModel");
exports.assignUser = async (req, res, next) => {
    try {
        // Check if the user ID is stored in the session
        if (req.session && req.session.userId) {
            // Find the user by ID from the session
            const user = await User.findById(req.session.userId);

            // If the user exists, assign it to req.user
            if (user) {
                req.user = user;
            } else {
                // If the user is not found, clear the session (optional)
                req.session.destroy(err => {
                    if (err) {
                        console.error("Error destroying session:", err);
                    }
                });
                return res.status(401).json({message:"Unauthorized"});
            }
        } else {
            // If no user ID in the session, return unauthorized
            return res.status(401).json({message:"Unauthorized"});
        }

        // Proceed to the next middleware/route
        next();
    } catch (error) {
        console.error("Error in assignUser middleware:", error);
        return res.status(500).send("Server Error");
    }
};
