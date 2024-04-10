import type { Response, Request } from "express";
import { handleHttp } from "../utils/error.handle";
import { ProductService } from "../services/product.service";

export class ProductController {
    static async createProduct({ body }: Request, res: Response) {
        try {
            const data = await ProductService.createProduct(body);
            res.send(data);
        } catch (error) {
            handleHttp(res, "ERROR_CREATE_USER", error);
        }
    }

    static async getProducts(req: Request, res: Response) {
        try {
            const { page, limit } = req.query;
            const data = await ProductService.getProducts(page as string, limit as string);
            res.send(data);
        } catch (error) {
            handleHttp(res, "ERROR_GET_USERS", error);
        }
    }

    static async getProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            res.send("Hola");
        } catch (error) {
            handleHttp(res, "ERROR_GET_USER", error);
        }
    }

    static async updateProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            res.send("Hola");
        } catch (error) {
            handleHttp(res, "ERROR_GET_USER", error);
        }
    }

    static async deleteProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            res.send("Hola");
        } catch (error) {
            handleHttp(res, "ERROR_GET_USER", error);
        }
    }
}
