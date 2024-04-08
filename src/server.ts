import chalk from './utils/colors';
import express from 'express';
import config from './config';
import routes from './routes';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(config.port, () => {
    chalk.success(`🚀 Server running on port ${config.port}`);
})

// Routes
app.use('/api', routes);

export default app;
