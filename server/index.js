import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url); // for obtaining the file path of the current module being executed.
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());

app.use(helmet());
/*helmet() is a middleware package that helps secure the application by setting various HTTP headers. It provides a collection of middleware functions, each of which sets a different header. When called with no arguments, as in this code (app.use(helmet())), helmet sets a set of default headers that protect the application against common security vulnerabilities such as cross-site scripting (XSS), clickjacking, and CSRF (Cross-Site Request Forgery) attacks.*/

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
/*helmet.crossOriginResourcePolicy() is a middleware function provided by the helmet-crossorigin-resource-policy package. It sets the Cross-Origin-Resource-Policy header to control which cross-origin requests are allowed to access the resources of the server. In this code, it sets the policy option to "cross-origin", which allows cross-origin requests from any origin to access the server's resources.*/

app.use(morgan("common"));
/*morgan("common") is a middleware package that logs HTTP requests and responses. It provides various pre-defined logging formats, and the "common" format includes the standard Apache combined log format, which logs the remote IP address, request method, URL, HTTP version, status code, response size, and referrer. When used as middleware, morgan logs each HTTP request and response to the console or to a log file, depending on the configuration.*/

app.use(bodyParser.json({ limit: "30mb", extended: true }));
/*In this specific case, bodyParser.json() is a method that parses incoming requests with JSON payloads. The limit option specifies the maximum size in bytes allowed in the HTTP request body. In this case, the maximum allowed size is 30 megabytes. The extended option enables extended syntax for parsing complex JSON data structures.*/

app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); // to parse incoming requests with urlencoded payloads.

app.use(cors());    //invoke cross origin resource sharing policies

app.use("/assets", express.static(path.join(__dirname, "public/assets")));  //sets the directory of where we are gonna store our assets.

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
/*
Defining a storage engine for multer, a Node.js middleware used for handling multipart/form-data, which is commonly used for uploading files.
Configuring a storage engine for multer that will store uploaded files in the public/assets directory with their original file names. When multer is used in the application with this storage engine, it will automatically handle file uploads and store them in the specified directory.*/

const upload = multer({ storage });
/* The upload constant is created by passing the storage object to the multer function. This creates a new instance of multer that can be used as middleware in an Express.js application. */

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

        /* ADD DATA ONE TIME */
        // User.insertMany(users);
        // Post.insertMany(posts);
    })
    .catch((error) => console.log(`${error} did not connect`));