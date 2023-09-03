import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import { ADMIN_PASSWORD } from 'src/config/config';

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const adminPassword = req.body.adminPassword
  if (ADMIN_PASSWORD === adminPassword) {
      next();
  }
   else {
    res.status(403).send('Unauthorized');
  }
};
