import express, {Express, Request, Response} from 'express';
import dotenv from "dotenv";
import apiRouter from "./src/routers/api";
import bodyParser from "body-parser";
import helmet from "helmet";

dotenv.config()

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/", (req: Request, res: Response): void => {
    res.send("Hello World");
});

app.use('/api', apiRouter);

app.listen(port, function(){
    console.log('Listening on port %d', port)
});