import { Router } from "express";
import { param, body } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";
import { ProductController } from "../controllers/product.controller";

const router = Router();

router.post(
    "/",
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").notEmpty().withMessage("Price is required"),
    body("image").notEmpty().withMessage("Image is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("stock").notEmpty().withMessage("Stock is required"),
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
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").notEmpty().withMessage("Price is required"),
    body("image").notEmpty().withMessage("Image is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("stock").notEmpty().withMessage("Stock is required"),
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
