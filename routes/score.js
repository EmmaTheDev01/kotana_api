import express from 'express';
import {createScore, updateScore, findAllScores} from '../controllers/scoreController.js'
import { verifyUser } from '../utils/verifyToken.js';

const router = express.Router()

//create a new Score 

router.post("/", verifyUser, createScore);
//update a Score 

router.put("/:id", verifyUser, updateScore);
//delete a Score


//find  all Scores

router.get("/", findAllScores);

export default router;