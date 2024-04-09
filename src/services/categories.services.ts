import db from "../db/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class CategoriesService {
    static async getCategories() {
        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT * FROM `ProductCategories`"
        )
        return rows
    }
}