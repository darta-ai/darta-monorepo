import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import multer from 'multer'

export const upload = multer({ storage: multer.memoryStorage() });