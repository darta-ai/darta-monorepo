import {NextFunction, Request, Response} from 'express';

require('dotenv').config();


interface UserRequest extends Request {
  user: { user_id: string; role?: string };
}

export const verifyUserIsAdmin = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (idToken) {
    try {
      // !!!!! FIX !!!!!!
      if (req.user.user_id === process.env.ADMIN_UUID) {
        next()
      } else {
        res.status(403).send('Unauthorized');
      }
    } catch (error) {
      res.status(403).send('Unauthorized');
    }
  } else {
    res.status(403).send('Unauthorized');
  }
};
