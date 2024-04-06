import { Request, Response } from "express";
import { getItem, getItems } from "../services/user.service";
import { handleHttp } from "../utils/error.handle";

export const getUsers = async(req: Request, res: Response) => {
    try {
        const data = await getItems();
        res.send(data);
    } catch (error) {
        handleHttp(res, 'ERROR_GET_USERS', error)
    }
}

export const getUser = async(req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = await getItem(id);
        res.send(data);
    } catch (error) {
        handleHttp(res, 'ERROR_GET_USER', error)
    }
}