import 'reflect-metadata';

import cors from 'cors';
import * as dotenv from 'dotenv';
import express, {Request, Response} from 'express';
import http from 'http';
import {InversifyExpressServer} from 'inversify-express-utils';

import {container} from './config/container';

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const bodyParser = require('body-parser');

dotenv.config();

const server = new InversifyExpressServer(container);

const corsOptions = {
  origin: (origin: any, callback: any) => {
    // Check if the origin is from the same container or allowed host
    if (origin === 'http://localhost:1169' || origin === undefined) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// Configure and start the server
server.setConfig(app => {
  app.use(cors(corsOptions));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
});

const app = server.build();

const {PORT: port, VERSION: version} = process.env;

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

app.get('/version', (req: Request, res: Response) => {
  res.send(version);
});

httpServer.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}`);
});
