// import './arango';
// needed for the inversify container
import 'reflect-metadata';

import {Database} from 'arangojs';
import express, {Request, Response} from 'express';
import * as fs from 'fs';
import https from 'https';
import {Container} from 'inversify';
import path from 'path';

import {config} from './config';
import {ArangoArtworkService, ArangoUserService} from './services';
import {Artwork, ArtworkService, User, UserService} from './services/types';

// Load the SSL certificate and key files
const privateKey = fs.readFileSync(
  path.join(__dirname, `/ssl/private-key.pem`),
  'utf8',
);
const certificate = fs.readFileSync(
  path.join(__dirname, `/ssl/certificate.pem`),
  'utf8',
);

const container = new Container();
const agent = new https.Agent({
  rejectUnauthorized: false,
});

container.bind(Database).toConstantValue(
  // Configure the ArangoDB connection
  new Database({
    url: config.arango.url!,
    databaseName: config.arango.database!,
    auth: {
      username: config.arango.user!,
      password: '',
    },
    agentOptions: {
      key: privateKey,
      cert: certificate,
      passphrase: 'darta',
    },
    agent,
  }),
);
container.bind<UserService>(ArangoUserService).toSelf();
container.bind<ArtworkService>(ArangoArtworkService).toSelf();

const userRepository = container.get<UserService>(ArangoUserService);
const artworkRepository = container.get<ArtworkService>(ArangoArtworkService);

console.log('hi from index');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const credentials = {
  key: privateKey,
  cert: certificate,
  passphrase: 'darta',
};

const httpsServer = https.createServer(credentials, app);

const PORT = process.env.PORT || 1160;

console.log('hi from app get');

// get an artwork by uuid
app.get('/artwork/get/:key', async (req: Request, res: Response) => {
  try {
    const artwork = await artworkRepository.getArtwork(req.params.key);
    if (artwork) {
      res.json(artwork);
    } else {
      res.status(404).send('Artwork not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// create an artwork
app.post('/artwork/create', async (req: Request, res: Response) => {
  try {
    const artwork: Artwork = req.body;
    const createdArtwork = await artworkRepository.createArtwork(artwork);
    res.status(201).json(createdArtwork);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

// update an artwork
app.put('/artwork/update', async (req: Request, res: Response) => {
  try {
    const artwork: Artwork = req.body;
    const updatedArtwork = await artworkRepository.updateArtwork(artwork);
    res.status(201).json(updatedArtwork);
  } catch (err: any) {
    if (err.message) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send('Internal server error');
    }
  }
});

// Get a user by key
app.get('/user/get/:key', async (req: Request, res: Response) => {
  try {
    const user = await userRepository.getUser(req.params.key);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// Create a user dummy
app.post('/user/create', async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    const createdUser = await userRepository.createUser(user);
    res.status(201).json(createdUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// Update a user
app.put('/user/update/:deviceId', async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    const updatedUser = await userRepository.updateUser(user);
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

app.get('/ping', async (req: Request, res: Response) => {
  console.log('pong');
  res.status(200).send('pong');
});

app.get('/', async (req: Request, res: Response) => {
  console.log('got');
  res.send('Welcome to Darta!');
});

httpsServer.listen(PORT, () => {
  console.log(`Server running at https://localhost:${PORT}`);
});
