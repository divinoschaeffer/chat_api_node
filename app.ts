import express, {Express, Request, Response} from 'express';
const app: Express = express();

app.get("/", (req: Request, res: Response): void => {
    res.send("Hello World");
});

app.listen(3000, function(){
    console.log('Listening on port 3000');
});