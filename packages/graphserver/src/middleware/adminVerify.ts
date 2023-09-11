import {NextFunction, Request, Response} from 'express';

import {ADMIN_PASSWORD} from '../config/config';

export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {adminPassword} = req.body;
  if (ADMIN_PASSWORD === adminPassword) {
    next();
  } else {
    res.status(403).send('Unauthorized');
  }
};
