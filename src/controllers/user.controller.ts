import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { handleHttp } from "../utils/error.handle";

export class UserController {
    static async createUser(req: Request, res: Response) {
        try {
            const body = req.body;
            const data = await UserService.createUser(body);
            res.send(data);
        } catch (error) {
            handleHttp(res, "ERROR_CREATE_USER", error);
        }
    }

    // Change this to authenticate with email and password
    static async getUsers(req: Request, res: Response) {
        try {
            const data = await UserService.authenticateUser();
            res.send(data);
        } catch (error) {
            handleHttp(res, "ERROR_GET_USERS", error);
        }
    }

    static async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data = await UserService.getUserById(id);
            res.send(data);
        } catch (error) {
            handleHttp(res, "ERROR_GET_USER", error);
        }
    }
}
