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
            throw new Error("Error creating product");
        }
        return {
            success: true,
            message: "Product created successfully",
            productId: rows.insertId,
        };
    }

    static async getProducts() {}

    static async getProductById(id: string) {}
}
