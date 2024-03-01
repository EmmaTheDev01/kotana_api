import User from "../models/User.js";

//UPDATING USER DETAILS
export const updateUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { $set: req.body }, { new: true });
        res.status(200).json({
            success: true,
            message: "Successfully updated user",
            data: updatedUser
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to update user'
        });
    }
};
//DELETE A USER
export const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        await User.findByIdAndDelete(userId);
        return res.status(200).json({
            success: true,
            message: 'Successfully deleted user'
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete user'
        });
    }
};
//FINDING A SINGLE USER
export const findUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const foundUser = await User.findById(userId);
        return res.status(200).json({
            success: true,
            message: 'User details found',
            data: foundUser,
        });
    } catch (err) {
        return res.status(404).json({
            success: false,
            message: 'Failed to find user'
        });
    }
};
//RETRIEVE ALL USERS
export const findAllUsers = async (req, res) => {
    const allUsers = await User.find({});

    if (allUsers.length > 0) {
        res.status(200).json({
            success: true,
            message: 'All users available',
            data: allUsers
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'No users available'
        });
    }
};
//FINDING ALL ONLINE USERS
export const findAllOnlineUsers = async (req, res) => {
    try {
        // Find users where the online status is true
        const onlineUsers = await User.find({ online: true });
        if (onlineUsers.length > 0) {
            res.status(200).json({
                success: true,
                message: 'Online users available',
                data: onlineUsers
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No online users available'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch online users'

        });
    }
};
//UPDATING USERONLINE STATUS

// Update user's online status controllers
// Update user's online status controllers
export const updateOnlineStatus = async (req, res) => {
    const userId = req.user.id; // Assuming you have a middleware to extract user information from the JWT

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }

        user.online = false;
        await user.save();

        res.status(200).json({
            success: true,
            message: "User online status updated successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update user online status",
        });
    }
};

