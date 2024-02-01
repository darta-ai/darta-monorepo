import {NextFunction, Request, Response} from 'express';

require('dotenv').config();

export const verifyUserIsAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (idToken) {
    try {
      // !!!!! FIX !!!!!!
      console.log('idToken', idToken, 'user', req);
      next()
    } catch (error) {
      res.status(403).send('Unauthorized');
    }
  } else {
    res.status(403).send('Unauthorized');
  }
};
