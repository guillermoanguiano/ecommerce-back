import { Router } from "express";
import UserRoutes from "./user.routes";
import ProductRoutes from "./product.routes";

const router = Router();

router.use("/users", UserRoutes);
router.use("/products", ProductRoutes);

export default router;
