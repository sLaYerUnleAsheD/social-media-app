import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import bcrypt from 'bcrypt';
import cors from 'cors';
import multer from 'multer';
// Native packages
import path from 'path';
import { fileURLToPath } from 'url';
// import authRoutes (for authentication feature for login) 
// from routes directory where we will have path
// and routes for every type of feature
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
// importing auth.js for registering users
import { register } from './controllers/auth.js';
import { createPost } from './controllers/posts.js';
import { verifyToken } from './middleware/auth.js';
import User from './models/User.js';
import Post from './models/Post.js';
import { users, posts } from './data/index.js';

// CONFIGURATIONS

const __filename = fileURLToPath(import.meta.url);
// above line of code gets the file path of the current module by converting 
//the URL provided by import.meta.url to a file path using fileURLToPath(), 
//and stores it in the __filename constant variable.
const __dirname = path.dirname(__filename);
// above line will give us directory name of current module from file path of it
// we use these above things when we are working as "type": "module" in package.json
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet);
app.use(helmet.crossOriginResourcePolicy( { policy: "cross-origin" } ));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// FILE STORAGE

// whenever someone uploads a file it is gonna be stored in public/assets
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
// to upload files we will use this below `upload` variable
// which references the storage variable to set destination of that file
const upload = multer({ storage });

// ROUTES WITH FILES

// `upload.single` in below line is a middleware which uploads an image locally
// to the destination we mentioned above
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// ROUTES

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// MONGOOSE SETUP

// if our dedicated port in .env file fails then use 6001
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then( () => {
    app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
    // manually injecting data to DB below: 
    // Adding only once which is why it will be commented out
    // after first execution
    // User.insertMany(users);
    // Post.insertMany(posts);

}).catch((error) => console.log(`${error} did not connect.`));
