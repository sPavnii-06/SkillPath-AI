import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import profileRoutes from './routes/profileRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import learningRoutes from './routes/learningRoutes.js';
dotenv.config();

await connectDB();

const app = express();
const PORT = process.env.PORT;
app.use(cors({
    origin: 'https://skill-path-ai-nine.vercel.app',
    credentials: true
}));
app.use(express.json());

app.use(cookieParser());


app.use('/api/auth', authRoutes)
app.use('/api/profiles', profileRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/learning', learningRoutes);

app.get('/api/health' , (req, res) => {
    res.json({
        status: 'ok',
        message: "SkillPath AI API is running"
    })


})
app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`))

//singhpavni2006_db_user
//  // SJwduO7oxkS6n3IR