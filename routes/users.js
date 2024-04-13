import express from 'express';
import { deleteUser, findAllOnlineUsers, findAllUsers, findUser, updateOnlineStatus, updateUser } from '../controllers/userController.js';

const router = express.Router();

// GET ONLINE USERS
router.get("/online", findAllOnlineUsers);

// UDATE USER DETAILS
router.put("/:id", updateUser);

// DELETE A USER
router.delete("/:id", deleteUser);

// FIND ONE USER
router.get("/:id", findUser);

// SET ONLINE STATUS
router.put("/online/reset", updateOnlineStatus);


// FIND ALL USERS
router.get("/", findAllUsers);

export default router;
