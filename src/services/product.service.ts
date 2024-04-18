import db from "../db/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { CloudinaryResult, Product } from "../interfaces/product.interface";
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

    static async InsertProductImages(productId: number, Image: string[]) {
        const [productExists] = await db.query<RowDataPacket[]>(
            "SELECT * FROM `Products` WHERE id = ?",
            [productId]
        );
        console.log(productId);
        if (!productExists.length) {
            throw new Error("Product not found");
        }
        const result: Promise<CloudinaryResult>[] = Image.map(async (image) => {
            const res = await Cloudinary.uploader.upload(image, {
                folder: "products/" + productId,
            });
            return {
                imageUrl: res.secure_url,
                imagePublicId: res.public_id,
            };
        });
        const imagesData = await Promise.all(result);
        if (imagesData.length === 0) {
            throw new Error("Error uploading images");
        }
        for (const image of imagesData) {
            await db.query<ResultSetHeader>(
                "INSERT INTO `ProductImages` (`productId`, `imageUrl`, `imagePublicId`) VALUES (?, ?, ?)",
                [productId, image.imageUrl, image.imagePublicId]
            );
        }

        return {
            success: true,
            message: "Product images created successfully",
            productId: productId,
        };
    }

    static async createProduct(product: Product) {
        const { name, description, price, images, category, stock } = product;
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
        // const result = await Cloudinary.uploader.upload(image, {
        //     folder: "products",
        // });
        // const img = {
        //     imageUrl: result.secure_url,
        //     imagePublicId: result.public_id,
        // };
        const [rows] = await db.query<ResultSetHeader>(
            "INSERT INTO `Products` (`name`, `description`, `price`, `categoryId`, `stock`) VALUES (?, ?, ?, ?, ?)",
            [name, description, price, categoryId, stock]
        );
        const id = rows.insertId;
        const imgResult = await this.InsertProductImages(id, product.images);
        if (!imgResult.success) {
            throw new Error("Error uploading images");
        }

        return {
            success: true,
            message: "Product created successfully",
            productId: rows.insertId,
        };
    }

    static async getProducts(page: number = 1, limit: number = 10) {
        const offset = page === 1 ? 0 : (page - 1) * limit;
        console.log(offset);
        const query = `
            SELECT 
                u.id, 
                u.name, 
                u.description, 
                u.price, 
                GROUP_CONCAT(pi.imageUrl) AS imageUrls, 
                u.stock, 
                c.name AS category 
            FROM 
                Products u 
            LEFT JOIN 
                ProductCategories c ON u.categoryId = c.id 
            LEFT JOIN 
                ProductImages pi ON u.id = pi.productId
            GROUP BY 
                u.id
            LIMIT ? OFFSET ?;
        `;
        const queryCount = "SELECT COUNT(*) AS total FROM `Products`";

        const [rows] = await db.query<RowDataPacket[]>(query, [limit, offset]);
        const [countRows] = await db.query<RowDataPacket[]>(queryCount);
        if (!countRows[0].total) {
            return { total: 0, list: [] };
        }
        rows.forEach((row) => {
            if (row.imageUrls) {
                row.imageUrls = row.imageUrls.split(",");
            }
        })
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
