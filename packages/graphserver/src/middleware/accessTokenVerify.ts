import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (idToken) {
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      (req as any).user = decodedToken;
      next();
    } catch (error) {
      res.status(403).send('Unauthorized');
    }
  } else {
    res.status(403).send('Unauthorized');
  }
};
