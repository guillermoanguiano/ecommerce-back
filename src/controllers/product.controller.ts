import type { Response, Request } from "express";
import { handleHttp } from "../utils/error.handle";

export class ProductController {
    static async createProduct({ body }: Request, res: Response) {
        try {
            res.send("Hola");
        } catch (error) {
            handleHttp(res, "ERROR_CREATE_USER", error);
        }
    }

    static async getProducts(_: Request, res: Response) {
        try {
            res.send("Hola");
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
