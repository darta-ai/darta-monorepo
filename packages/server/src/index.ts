import 'reflect-metadata';

import express, {Request, Response} from 'express';
import http from 'http';

import {config} from './config';
import {container} from './container';
import {startServices} from './services';

container.bind<express.Application>('ExpressApp').toConstantValue(express());
const app = container.get<express.Application>('ExpressApp');

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

httpServer.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${config.port}`);
});
