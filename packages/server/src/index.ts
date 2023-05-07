import './arango';
// needed for the inversify container
import 'reflect-metadata';

import {Database} from 'arangojs';
import express, {Request, Response} from 'express';
import * as fs from 'fs';
import https from 'https';
import {Container} from 'inversify';

import {config} from './config';
import {ArangoUserService} from './services';
import {User, UserService} from './services/types';

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
    agent,
  }),
);
container.bind<UserService>(ArangoUserService).toSelf();

const userRepository = container.get<UserService>(ArangoUserService);

console.log('hi from index');

const app = express();

// Load the SSL certificate and key files
const privateKey = fs.readFileSync('./keys/private-key.pem', 'utf8');
const certificate = fs.readFileSync(
  'monorepo/packages/server/src/keys/certificate.pem',
  'utf8',
);

const credentials = {
  key: privateKey,
  cert: certificate,
};

const httpsServer = https.createServer(credentials, app);

const PORT = process.env.PORT || 1160;

app.get('/', async (req: Request, res: Response) => {
  res.send('Welcome to Darta!');
});

// app.get('/user', async (req: Request, res: Response) => {
//   console.log({req});
//   // validate the request

//   // perform function from userService.getUser(userId)

//   // return the user object
//   res.json({
//     profilePicture:
//       'https://www.shutterstock.com/image-photo/closeup-photo-amazing-short-hairdo-260nw-1617540484.jpg',
//     userName: 'user name 10000',
//     legalName: 'firstName lastName',
//     email: 'email@gmail.com',
//     phone: '(123) 123-4567',
//   });
// });

// app.post user/saves
// app.post user/pat/pretty-artwork-today

app.post('/user', async (req: Request, res: Response) => {
  res.json({
    profilePicture: 'nothingtoseehere.jpeg',
  });
});

// Routes for interactions
// create edge between user and artwork

// Get a user by key
app.get('/user/:key', async (req: Request, res: Response) => {
  console.log({req: req.params});
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

// Create a user
app.post('/user', async (req: Request, res: Response) => {
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
app.put('/user/:key', async (req: Request, res: Response) => {
  try {
    const user: User = {...req.body, _key: req.params.key};
    const updatedUser = await userRepository.updateUser(user);
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

httpsServer.listen(PORT, () => {
  console.log(`Server running at https://localhost:${PORT}`);
});
