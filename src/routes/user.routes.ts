import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { param, body } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";
import { validateRequiredFields } from "../utils/error.handle";

const router = Router();

router.post(
    "/",
    ...validateRequiredFields(["firstName", "lastName", "email", "password"]),
    handleInputErrors,
    UserController.createUser
);

router.post(
    "/auth",
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    handleInputErrors,
    UserController.authenticateUser
);

router.get("/", UserController.getUsers);
router.get(
    "/:id",
    param("id").isNumeric().withMessage("Invalid ID"),
    handleInputErrors,
    UserController.getUserById
);

export default router;
