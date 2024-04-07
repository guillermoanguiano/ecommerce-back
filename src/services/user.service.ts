import { User } from "@/interfaces/User";
import db from "@/db/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    static async authenticateUser(user: User) {
        const [userExists] = await db.query<RowDataPacket[]>(
            "SELECT * FROM `Users` WHERE email = ?",
            [user.email]
        );
        if (userExists.length === 0) {
            throw new Error("User not found");
        }
        const validatePassword = await bcrypt.compare(
            user.password,
            user.password
        );
        if (!validatePassword) {
            throw new Error("Invalid password");
        }
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const accessToken = jwt.sign(
            {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                admin: user.admin,
            },
            accessTokenSecret,
            {
                expiresIn: "2h",
            }
        );
        return { accessToken };
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
