import { Application } from 'express';
import { CrudService } from './CrudService';
import * as repositories from '../repositories';

export function startServices(app: Application): void {
  Object.values(repositories).forEach((repository) => {
    new CrudService(app, repository);
  });
}