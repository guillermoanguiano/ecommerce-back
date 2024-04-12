import db from "../db/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import Cloudinary from "../utils/cloudinary";

export class CategoriesService {
    static async checkIfCategoryExists(name: string): Promise<Boolean> {
        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT * FROM `ProductCategories` WHERE name = ?",
            [name]
        )
        return rows.length > 0;
    }

    static async getCategories() {
        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT id, name, icon FROM `ProductCategories`"
        )
        return rows
    }

    static async createCategory(name: string, icon: string) {
        const categoryExists = await this.checkIfCategoryExists(name);
        if (categoryExists) {
            throw new Error("Category already exists");
        }
        const result = await Cloudinary.uploader.upload(icon, {
            folder: "categories"
        })
        const [rows] = await db.query<ResultSetHeader>(
            "INSERT INTO `ProductCategories` (`name`, `icon`, `iconId`) VALUES (?, ?, ?)",
            [
                name, 
                result.secure_url, 
                result.public_id
            ]
        )
        if (rows.affectedRows === 0) {
            await Cloudinary.uploader.destroy(result.public_id)
            throw new Error("Error creating category");
        }

        return {
            success: true,
            message: "Category created successfully",
            categoryId: rows.insertId
        }
    }
}