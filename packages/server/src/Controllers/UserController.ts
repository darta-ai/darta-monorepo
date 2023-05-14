import express, {Request, Response} from 'express';
import {injectable} from 'inversify';

import {UserService} from '../Services/UserService';

@injectable()
export class UserController {
  constructor(private userService: UserService) {
    this.userService = userService;
  }

  routes() {
    const router = express.Router();

    router.get('/:deviceId', async (req: Request, res: Response) => {
      try {
        const users = await this.userService.userLogin(req.params.key);
        res.json(users);
      } catch (err: any) {
        res.status(500).send(err.message);
      }
    });

    router.put('/:deviceId', async (req: Request, res: Response) => {
      try {
        const user = req.body;
        const updatedUser = await this.userService.updateUser(user);
        res.status(201).json(updatedUser);
      } catch (err: any) {
        if (err.message) {
          res.status(400).send(err.message);
        } else {
          res.status(500).send('Internal server error');
        }
      }
    });

    // Define other routes here...

    return router;
  }
}
