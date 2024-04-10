import chalk from "./utils/colors";
import express from "express";
import config from "./config";
import routes from "./routes";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 50000,
    })
);
app.use(express.json());

app.listen(config.port, () => {
    chalk.success(`🚀 Server running on port ${config.port}`);
});

// Routes
app.use("/api", routes);

export default app;
