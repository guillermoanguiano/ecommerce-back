import { Router } from "express";
import UserRoutes from "./user.routes";
import ProductRoutes from "./product.routes";
import CategoriesRoutes from "./categories.routes";

const router = Router();

router.use("/users", UserRoutes);
router.use("/products", ProductRoutes);
router.use("/categories", CategoriesRoutes);

export default router;
