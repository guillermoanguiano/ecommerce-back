import db from "../db/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Product } from "../interfaces/product.interface";
import Cloudinary from "../utils/cloudinary";
import { Query } from "express-serve-static-core";

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
        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT u.id, u.name, u.description, u.price, u.imageUrl, u.stock, c.name, COUNT(*) AS total, c.name AS category FROM `Products` u JOIN `ProductCategories` c ON u.categoryId = c.id GROUP BY u.id LIMIT ? OFFSET ?",
            [Number(limit), offset]
        );
        if (!rows.length) {
            return { message: "No products found" };
        }
        const product = {
            id: rows[0].id,
            name: rows[0].name,
            description: rows[0].description,
            price: rows[0].price,
            image: rows[0].imageUrl,
            category: rows[0].category,
            stock: rows[0].stock,
        }
        const response = {
            total: rows[0].total,
            products: [product]
        }
        return response;
    }

    static async getProductById(id: string) {}
}
