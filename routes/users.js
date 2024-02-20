import express from 'express';
import { deleteUser, findAllOnlineUsers, findAllUsers, findUser, updateUser, updateUserStatus } from '../controllers/userController.js';
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

// GET ONLINE USERS
router.get("/online", findAllOnlineUsers);

// UDATE USER DETAILS
router.put("/:id", verifyUser, updateUser);

// DELETE A USER
router.delete("/:id", verifyAdmin, deleteUser);

// FIND ONE USER
router.get("/:id", findUser);

// SET ONLINE STATUS
router.put("/online/:id", verifyUser, updateUserStatus);

// FIND ALL USERS
router.get("/", verifyAdmin, findAllUsers);

export default router;
