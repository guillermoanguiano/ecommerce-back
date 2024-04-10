import { Router } from "express";
import { param, body } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";
import { ProductController } from "../controllers/product.controller";

const router = Router();

router.post(
    "/",
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Last Name is required"),
    body("price").notEmpty().withMessage("Email is required"),
    body("image").notEmpty().withMessage("Password is required"),
    body("category").notEmpty().withMessage("Password is required"),
    body("stock").notEmpty().withMessage("Password is required"),
    handleInputErrors,
    ProductController.createProduct
);

router.get("/", ProductController.getProducts);
router.get(
    "/:id",
    param("id").isNumeric().withMessage("Invalid ID"),
    handleInputErrors,
    ProductController.getProductById
);

router.delete(
    "/:id",
    param("id").isNumeric().withMessage("Invalid ID"),
    handleInputErrors,
    ProductController.deleteProduct
);

export default router;
