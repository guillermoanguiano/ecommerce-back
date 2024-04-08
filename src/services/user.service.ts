import { User } from "../interfaces/User";
import db from "../db/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config";

export class UserService {
    private static async checkIfUserExists(email: string): Promise<Boolean> {
        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT * FROM `Users` WHERE email = ?",
            [email]
        );
        return rows.length > 0;
    }

    static async createUser(user: User) {
        const userExists = await this.checkIfUserExists(user.email);
        if (userExists) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        if (!user.admin) {
            user.admin = false;
        }
        const [result] = await db.query<ResultSetHeader>(
            "INSERT INTO `Users` (`firstName`, `lastName`, `email`, `password`, `admin`) VALUES (?, ?, ?, ?, ?)",
            [
                user.firstName,
                user.lastName,
                user.email,
                hashedPassword,
                user.admin,
            ]
        );
        if (result.affectedRows === 0) {
            throw new Error("Error creating user");
        }
        return {
            success: true,
            message: "User created successfully",
            userId: result.insertId,
        };
    }

    static async authenticateUser(user: { email: string; password: string }) {
        const [userExists] = await db.query<RowDataPacket[]>(
            "SELECT * FROM `Users` WHERE email = ?",
            [user.email]
        );
        if (userExists.length === 0) {
            throw new Error("User not found");
        }
        const validatePassword = await bcrypt.compare(
            user.password,
            userExists[0].password
        );
        if (!validatePassword) {
            throw new Error("Invalid password");
        }
        const userData = {
            id: userExists[0].id,
            firstName: userExists[0].firstName,
            lastName: userExists[0].lastName,
            email: userExists[0].email,
            admin: userExists[0].admin,
        };
        const accessTokenSecret = config.jwtSecret;
        const accessToken = jwt.sign(userData, accessTokenSecret, {
            expiresIn: "1h",
        });
        return { ...userData, accessToken };
    }

    static async getUsers() {
        const [rows] = await db.query(
            "SELECT u.id, u.firstName, u.lastName, u.email, u.admin FROM `Users` u"
        );
        return rows;
    }

    static async getUserById(id: string) {
        const [rows] = await db.query(
            "SELECT u.id, u.firstName, u.lastName, u.email, u.admin FROM `Users` u WHERE u.id = ?",
            [id]
        );
        return rows;
    }
}
