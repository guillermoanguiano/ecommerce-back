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

router.post(
    "/images/:productId",
    param("productId").isNumeric().withMessage("Invalid ID"),
    body("image").notEmpty().withMessage("Image is required"),
    handleInputErrors,
    ProductController.UploadProductImages
)

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
    ...validateRequiredFields(["name", "description", "price", "category", "stock"]),
    body("image").notEmpty().isBase64().withMessage("Image is required"),
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
