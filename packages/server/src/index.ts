// import './arango';
// needed for the inversify container
import 'reflect-metadata';

import express, {Request, Response} from 'express';
import * as fs from 'fs';
import https from 'https';
import path from 'path';

import {
  artworkRepository,
  container,
  createCollections,
  ratingRepository,
} from './container';
import {UserController} from './Controllers/UserController';
import {UserService} from './Services/UserService';
import {Artwork, Rating} from './types';

console.log('began server');

// Load the SSL certificate and key files
const privateKey = fs.readFileSync(
  path.join(__dirname, `/ssl/private-key.pem`),
  'utf8',
);
const certificate = fs.readFileSync(
  path.join(__dirname, `/ssl/certificate.pem`),
  'utf8',
);

console.log('got private keys');

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

const userService = container.get<UserService>('UserService');
const userController = new UserController(userService);

app.use('/user', userController.routes());

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

// // Get a user by key
// app.get('/user/get/:key', async (req: Request, res: Response) => {
//   try {
//     const user = await userRepository.getUser(req.params.key);
//     if (user) {
//       res.json(user);
//     } else {
//       res.status(404).send('User not found');
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal server error');
//   }
// });

// // Create a user dummy
// app.post('/user/create', async (req: Request, res: Response) => {
//   try {
//     const user: User = req.body;
//     const createdUser = await userRepository.createUser(user);
//     res.status(201).json(createdUser);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal server error');
//   }
// });

// // Update a user
// app.put('/user/update/:deviceId', async (req: Request, res: Response) => {
//   try {
//     const user: User = req.body;
//     const updatedUser = await userRepository.updateUser(user);
//     res.json(updatedUser);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal server error');
//   }
// });

app.post('/rating/create', async (req: Request, res: Response) => {
  try {
    const rating: Rating = req.body;
    const createdRating = await ratingRepository.createUserArtworkEdge(rating);
    res.status(201).json(createdRating);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

app.put('/rating/update', async (req: Request, res: Response) => {
  try {
    const rating: Rating = req.body;
    const updatedRating = await ratingRepository.updateUserArtworkEdge(rating);
    res.status(201).json(updatedRating);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

app.get('/rating/get/:key', async (req: Request, res: Response) => {
  try {
    const rating = await ratingRepository.getUserArtworkEdge(req.params.key);
    if (rating) {
      res.json(rating);
    } else {
      res.status(404).send('Rating not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

app.get('/ping', async (req: Request, res: Response) => {
  console.log('pong');
  res.status(200).send('pong');
});

app.get('/createCollections', async (req: Request, res: Response) => {
  try {
    await createCollections.createCollections();
    res.status(200).send('Collections created');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

app.get('/', async (req: Request, res: Response) => {
  console.log('got');
  res.send('Welcome to Darta!');
});

httpsServer.listen(PORT, () => {
  console.log(`Server running at https://localhost:${PORT}`);
});
