import express from 'express';
import cors from 'cors';
import skillRoutes from './routes/skills';
import experienceRoutes from './routes/experiences';
import projectRoutes from './routes/projects';
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import contactRoutes from './routes/contact';
import cookieParser from "cookie-parser";

const app = express();

const port = process.env.PORT || 10000;

app.use(cors({
    origin: ['https://zayouta-bilal.vercel.app',
        /^http:\/\/localhost:\d+$/
    ], // frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// API routes
app.use('/api/skills', skillRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));