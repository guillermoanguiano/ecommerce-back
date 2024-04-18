import type { Response, Request } from "express";
import { handleHttp } from "../utils/error.handle";
import { ProductService } from "../services/product.service";

export class ProductController {
    static async createProduct({ body }: Request, res: Response) {
        try {
            const data = await ProductService.createProduct(body);
            res.send(data);
        } catch (error) {
            handleHttp(res, "Error while creating product", error);
        }
    }

    static async UploadProductImages(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { images } = req.body;
            const data = await ProductService.InsertProductImages(Number(id), images);
            res.send(data);
        } catch (error) {
            handleHttp(res, "Error while uploading images", error);
        }
    }

    static async getProducts(req: Request, res: Response) {
        try {
            const { page, limit } = req.query;
            const data = await ProductService.getProducts(Number(page), Number(limit));
            res.send(data);
        } catch (error) {
            handleHttp(res, "Error while getting products", error);
        }
    }

    static async getProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data = await ProductService.getProductById(id);
            res.send(data);
        } catch (error) {
            handleHttp(res, "Error getting product", error);
        }
    }

    static async updateProduct({ body }: Request, res: Response) {
        try {
            const data = await ProductService.updateProduct(body);
            res.send(data);
        } catch (error) {
            handleHttp(res, "Error updating product", error);
        }
    }

    static async deleteProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data = await ProductService.deleteProduct(id);
            res.send(data);
        } catch (error) {
            handleHttp(res, "Error deleting product", error);
        }
    }
}
