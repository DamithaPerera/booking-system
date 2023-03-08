import express, {Express, NextFunction, Request, Response} from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import hotelRouter from "./module/hotel/hotel.router";
import {authRequest} from "./util/auth";

// Load environment variables from .env file
dotenv.config();
// Create Express app instance
const app: Express = express();
// Set port number
const port = process.env.PORT || 3000;
// Use body-parser middleware to parse request body
app.use(bodyParser.json());

// Authenticate all requests
app.use((req: Request, res: Response, next: NextFunction) => {
    authRequest(req, res, next);
});

// Register hotel router
app.use("/v1/hotels", hotelRouter)

// Start server and listen on specified port
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});