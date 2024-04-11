import { Response } from "express";
import chalk from "./colors";
import { body } from "express-validator";

export const handleHttp = (res: Response, error: string, errorRaw?: any) => {
  chalk.error(errorRaw);
  res.status(500);
  res.send({ error })
};

export const validateRequiredFields = (fields: string[]) => {
    return fields.map(field => body(field).notEmpty().withMessage(`${field} is required`));
};