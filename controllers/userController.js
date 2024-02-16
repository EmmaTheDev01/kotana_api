import User from "../models/User.js";


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

export const updateUserStatus = async (req, res) => {
    const userId = req.params.id;
    const { online } = req.body; // Assuming you'll send the online status in the request body
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { $set: { online } }, { new: true });
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