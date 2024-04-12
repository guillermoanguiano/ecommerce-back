import db from "../db/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Product } from "../interfaces/product.interface";
import Cloudinary from "../utils/cloudinary";

export class ProductService {
    private static async checkIfProductExists(
        name: string,
        categoryId: number
    ): Promise<Boolean> {
        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT * FROM `Products` WHERE name = ? AND categoryId = ?",
            [name, categoryId]
        );
        return rows.length > 0;
    }

    static async createProduct(product: Product) {
        const { name, description, price, image, category, stock } = product;
        const [categoryRow] = await db.query<RowDataPacket[]>(
            "SELECT id FROM `ProductCategories` WHERE name = ?",
            [category]
        );
        if (!categoryRow.length) {
            throw new Error("Category not found");
        }
        const categoryId = categoryRow[0].id;
        const productExists = await this.checkIfProductExists(name, categoryId);
        if (productExists) {
            throw new Error("Product already exists");
        }
        const result = await Cloudinary.uploader.upload(image, {
            folder: "products",
        });
        const img = {
            imageUrl: result.secure_url,
            imagePublicId: result.public_id,
        };
        const [rows] = await db.query<ResultSetHeader>(
            "INSERT INTO `Products` (`name`, `description`, `price`, `imageUrl`, `categoryId`, `stock`, `imagePublicId`) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                name,
                description,
                price,
                img.imageUrl,
                categoryId,
                stock,
                img.imagePublicId,
            ]
        );
        if (rows.affectedRows === 0) {
            await Cloudinary.uploader.destroy(img.imagePublicId);
            throw new Error("Error creating product");
        }
        return {
            success: true,
            message: "Product created successfully",
            productId: rows.insertId,
        };
    }

    static async getProducts(page: string = "1", limit: string = "10") {
        const offset = (Number(page) - 1) * Number(limit);

        const query = `
            SELECT u.id, u.name, u.description, u.price, u.imageUrl, u.stock, c.name AS category FROM \`Products\` u 
            JOIN \`ProductCategories\` c ON u.categoryId = c.id 
            LIMIT ? OFFSET ?;
        `;
        const queryCount = "SELECT COUNT(*) AS total FROM `Products`";

        const [rows] = await db.query<RowDataPacket[]>(query, [
            Number(limit),
            offset,
        ]);
        const [countRows] = await db.query<RowDataPacket[]>(queryCount);
        if (!countRows[0].total) {
            return { total: 0, list: [] };
        }
        const response = {
            total: countRows[0].total,
            list: rows,
        };
        return response;
    }

    static async getProductById(id: string) {
        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT u.id, u.name, u.description, u.price, u.imageUrl, u.stock, c.name AS category FROM `Products` u JOIN `ProductCategories` c ON u.categoryId = c.id WHERE u.id = ?",
            [id]
        );
        if (!rows.length) {
            throw new Error("Product not found");
        }
        return rows[0];
    }

    static async updateProduct(product: Product) {
        const { name, description, price, image, category, stock, id } =
            product;
        const [categoryRow] = await db.query<RowDataPacket[]>(
            "SELECT id FROM `ProductCategories` WHERE name = ?",
            [category]
        );
        if (!categoryRow.length) {
            throw new Error("Category not found");
        }
        const categoryId = categoryRow[0].id;
        const [imgId] = await db.query<RowDataPacket[]>(
            "SELECT imagePublicId FROM `Products` WHERE id = ?",
            [id]
        );
        await Cloudinary.uploader.destroy(
            imgId[0].imagePublicId,
            (err, result) => {
                if (err) {
                    throw new Error("Error deleting product");
                }
                console.log(result);
            }
        );
        const result = await Cloudinary.uploader.upload(image, {
            folder: "products",
        });
        const img = {
            imageUrl: result.secure_url,
            imagePublicId: result.public_id,
        };
        const [rows] = await db.query<ResultSetHeader>(
            "UPDATE `Products` SET `name` = ?, `description` = ?, `price` = ?, `imageUrl` = ?, `categoryId` = ?, `stock` = ?, `imagePublicId` = ? WHERE `id` = ?",
            [
                name,
                description,
                price,
                img.imageUrl,
                categoryId,
                stock,
                img.imagePublicId,
            ]
        );
        if (!rows.affectedRows) {
            throw new Error("Error updating product");
        }
        return {
            success: true,
            message: "Product updated successfully",
            productId: id,
        };
    }

    static async deleteProduct(id: string) {
        try {
            const [product] = await db.query<RowDataPacket[]>(
                "SELECT imagePublicId FROM `Products` WHERE id = ?",
                [id]
            );
            await Cloudinary.uploader.destroy(
                product[0].imagePublicId,
                (err, result) => {
                    if (err) {
                        throw new Error("Error deleting product");
                    }
                    console.log(result);
                }
            );
            const [rows] = await db.query<ResultSetHeader>(
                "DELETE FROM `Products` WHERE id = ?",
                [id]
            );
            if (rows.affectedRows === 0) {
                throw new Error("Error deleting product");
            }
            return {
                success: true,
                message: "Product deleted successfully",
                productId: id,
            };
        } catch (error) {
            throw new Error("Error deleting product");
        }
    }
}
