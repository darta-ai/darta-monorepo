import {Application} from 'express';

import * as repositories from '../repositories';
import {CrudService} from './CrudService';

export function startServices(app: Application): void {
  Object.values(repositories).forEach(repository => {
    new CrudService(app, repository);
  });
}
