import { Router } from "express";
import { CategoriesController } from "../controllers/categories.controller";
import { body } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";

const router = Router();

router.get("/", CategoriesController.getCategories);
router.post(
    "/",
    body("name").notEmpty().withMessage("Name is required"),
    handleInputErrors,
    CategoriesController.createCategory
);

export default router;
