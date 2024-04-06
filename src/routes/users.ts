import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller";
import { param, body } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";

const router = Router();

router.get("/", getUsers);
router.get(
    "/:id",
    param("id").isNumeric().withMessage("Invalid ID"),
    handleInputErrors,
    getUser
);

export default router;
