import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import hotelRouter from './module/hotel/hotel.router';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;


app.use('/v1/hotels', hotelRouter)


app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});