import express from 'express';

// importing controllers which will be used
// for 3 major routes in our project
import {
    getUser,
    getUserFriends,
    addRemoveFriend
} from '../controllers/users.js';

// import verifyToken middleware for verified users
// allowing them to access files which need authorization
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// READ

// Get request for a particular user id, (gets user)
router.get("/:id", verifyToken, getUser);
// gets user friends
router.get("/:id/friends", verifyToken, getUserFriends);

// UPDATE

router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;