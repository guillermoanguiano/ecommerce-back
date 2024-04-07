import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { param, body } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";

const router = Router();

router.post(
    "/",
    body("firstName").exists().withMessage("First Name is required"),
    body("lastName").exists().withMessage("Last Name is required"),
    body("email").exists().withMessage("Email is required"),
    body("password").exists().withMessage("Password is required"),
    handleInputErrors,
    UserController.createUser
);
router.get("/", UserController.getUsers);
router.get(
    "/:id",
    param("id").isNumeric().withMessage("Invalid ID"),
    handleInputErrors,
    UserController.getUserById
);

export default router;
