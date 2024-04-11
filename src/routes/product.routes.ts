import { Router } from "express";
import { param, body } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";
import { ProductController } from "../controllers/product.controller";
import { validateRequiredFields } from "../utils/error.handle";

const router = Router();

router.post(
    "/",
    ...validateRequiredFields(["name", "description", "price", "image", "category", "stock"]),
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

router.put(
    "/:id",
    param("id").isNumeric().withMessage("Invalid ID"),
    ...validateRequiredFields(["name", "description", "price", "image", "category", "stock"]),
    handleInputErrors,
    ProductController.updateProduct
)

router.delete(
    "/:id",
    param("id").isNumeric().withMessage("Invalid ID"),
    handleInputErrors,
    ProductController.deleteProduct
);

export default router;
