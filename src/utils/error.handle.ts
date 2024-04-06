import { Response } from "express";
import chalk from "./colors";

export const handleHttp = (res: Response, error: string, errorRaw?: any) => {
  chalk.error(errorRaw);
  res.status(500);
  res.send({ error })
};