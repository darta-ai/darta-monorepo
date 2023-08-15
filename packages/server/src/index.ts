import * as dotenv from 'dotenv';
import * as tsconfigPaths from 'tsconfig-paths';

const baseUrl = '.'; // This should match the baseUrl in your tsconfig.json

tsconfigPaths.register({
  baseUrl,
  paths: {
    "@/graph": ["../graph/src/"] // Adjust this path as needed based on your tsconfig.json
  }
});

import express, {Request, Response} from 'express';
import http from 'http';

import {startServices} from './services';

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

startServices(app);

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
