import db from "../db/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class CategoriesService {
    static async checkIfCategoryExists(name: string): Promise<Boolean> {
        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT * FROM `ProductCategories` WHERE name = ?",
            [name]
        );
        return rows.length > 0;
    }

    static async getCategories() {
        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT id, name FROM `ProductCategories`"
        );
        return rows;
    }

    static async createCategory(name: string) {
        const categoryExists = await this.checkIfCategoryExists(name);
        if (categoryExists) {
            throw new Error("Category already exists");
        }
        const [rows] = await db.query<ResultSetHeader>(
            "INSERT INTO `ProductCategories` (`name`) VALUES (?)",
            [name]
        );
        if (rows.affectedRows === 0) {
            throw new Error("Error creating category");
        }

        return {
            success: true,
            message: "Category created successfully",
            categoryId: rows.insertId,
        };
    }

    static async updateCategory(id: number, name: string, icon: string) {
        const [rows] = await db.query<ResultSetHeader>(
            "UPDATE `ProductCategories` SET `name` = ? WHERE `id` = ?",
            [name, id]
        );
        if (rows.affectedRows === 0) {
            throw new Error("Error updating category");
        }

        return {
            success: true,
            message: "Category updated successfully",
            categoryId: id,
        };
    }

    static async deleteCategory(id: string) {
        const [rows] = await db.query<ResultSetHeader>(
            "DELETE FROM `ProductCategories` WHERE id = ?",
            [id]
        );
        if (rows.affectedRows === 0) {
            throw new Error("Error deleting category");
        }
        return {
            success: true,
            message: "Category deleted successfully",
            categoryId: id,
        };
    }
}
