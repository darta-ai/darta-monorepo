import * as dotenv from 'dotenv';

import express, {Request, Response} from 'express';
import http from 'http';

dotenv.config();

const {PORT: port} = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const httpServer = http.createServer(app);

let n = 0;
app.get('/', (req: Request, res: Response) => {
  res.send(`${++n}`);
});

app.get('/ping', (req: Request, res: Response) => {
  res.send('pong');
});

app.get('/pong', (req: Request, res: Response) => {
  res.send('ping');
});

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
