import db from "../db/db";

export const getItems = async () => {
    const [rows] = await db.query(
        "SELECT u.id, u.firstName, u.lastName, u.email, u.admin FROM `Users` u"
    );
    return rows;
};

export const getItem = async (id: string) => {
    const [rows] = await db.query(
        "SELECT u.id, u.firstName, u.lastName, u.email, u.admin FROM `Users` u WHERE u.id = ?",
        [id]
    );
    return rows;
}
