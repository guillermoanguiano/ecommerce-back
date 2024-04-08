import config from "../config";
import { createPool, Pool, PoolOptions } from "mysql2/promise";

const { db } = config; 

const access: PoolOptions = {
    host: db.url,
    user: db.user,
    password: db.password,
    port: 3306,
    database: db.name,
}

const conn: Pool = createPool(access);

export default conn;