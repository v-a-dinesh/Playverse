import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

//routes
import authRoutes from './routes/auth.js';
import podcastsRoutes from './routes/podcast.js';
import userRoutes from './routes/user.js';

const app = express();
dotenv.config();

// Fix 1: Set up CORS before other middlewares
const corsConfig = {
    credentials: true,
    origin: 'http://localhost:3000', // Be specific in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsConfig));

// Fix 2: Increase payload size limit BEFORE routes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Optional: Add morgan for logging
app.use(morgan('dev'));

const port = process.env.PORT || 8700;

const connect = () => {
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log('MongoDB connected');
    }).catch((err) => {
        console.log(err);
    });
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/podcasts", podcastsRoutes);
app.use("/api/user", userRoutes);

// Error handler middleware (should be last)
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    connect();
});