import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { getMessage, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.route('/send/:id').post(isAuthenticated, getMessage);
router.route('/all/:id').get(isAuthenticated, sendMessage);

export default router;