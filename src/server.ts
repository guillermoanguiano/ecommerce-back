import chalk from './utils/colors';
import express from 'express';
import { port } from './config';
import routes from './routes';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    chalk.success(`🚀 Server running on port ${port}`);
})

// Routes
app.use('/api', routes);

export default app;
