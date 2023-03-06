import express, {Express, NextFunction, Request, Response} from 'express';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import hotelRouter from './module/hotel/hotel.router';
import {authRequest} from "./util/auth";


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Authenticate all requests
app.use((req: Request, res: Response, next: NextFunction) => {
    authRequest(req, res, next);
});

app.use('/v1/hotels', hotelRouter)


app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});