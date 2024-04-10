import { CategoriesService } from "../services/categories.service";
import type { Response, Request } from "express";
import { handleHttp } from "../utils/error.handle";


export class CategoriesController {
    static async getCategories(_: Request, res: Response) {
        try {
            const data = await CategoriesService.getCategories();
            res.send(data);
        } catch (error) {
            handleHttp(res, "ERROR_GET_CATEGORIES", error);
        }
    }

    static async createCategory({ body }: Request, res: Response) {
        try {
            const { name } = body
            const data = await CategoriesService.createCategory(name);
            res.send(data);
        } catch (error) {
            handleHttp(res, "ERROR_CREATE_CATEGORY", error);
        }
    }
}