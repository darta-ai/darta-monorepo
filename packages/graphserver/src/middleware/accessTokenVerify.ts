import {NextFunction, Request, Response} from 'express';

import {auth} from '../config/firebase';

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (idToken) {
    try {
      // !!!!! FIX !!!!!!
      const decodedToken = await auth.verifyIdToken(idToken);
      (req as any).user = decodedToken;
      next();
    } catch (error) {
      res.status(403).send('Unauthorized guy');
    }
  } else {
    res.status(403).send('Unauthorized my guy');
  }
};
