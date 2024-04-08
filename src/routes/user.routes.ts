import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { param, body } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";

const router = Router();

router.post(
    "/",
    body("firstName").notEmpty().withMessage("First Name is required"),
    body("lastName").notEmpty().withMessage("Last Name is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
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
