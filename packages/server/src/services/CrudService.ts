import express, { Request, Response } from 'express';

import {
  ArangoDocumentType,
  ArangoEdgeType,
  DocumentRepository,
  EdgeRepository,
} from '../repositories/ArangoRepository';

// TODO is an interface (or class) even needed here? Just functions?
interface ICrudService<
  D extends ArangoDocumentType | ArangoEdgeType,
  C extends DocumentRepository<D> | EdgeRepository<D>,
> {}

// TODO think through all error possiblities
export class CrudService<
  D extends ArangoDocumentType | ArangoEdgeType,
  C extends DocumentRepository<D> | EdgeRepository<D>,
> implements ICrudService<D, C> {
  protected repository: C;
  public name: string;

  constructor(
    app: express.Application,
    repository: any,// TODO proper types for containers
  ) {
    this.repository = repository;
    this.name = repository.name;
    
    app.get(`/${this.name}/:id`, this.get.bind(this));
    app.post(`/${this.name}`, this.post.bind(this));
    app.put(`/${this.name}`, this.put.bind(this));
    app.delete(`/${this.name}/:id`, this.del.bind(this));
  }

  private async get(req: Request, res: Response) {
    const id = req.params?.id;
    if (!id) return res.status(400).send('/:id parameter is required');

    try {
      const doc = await this.repository.read(id);
      res.json(doc);

    } catch (err: any) {
      if (err.code === 404) return res.status(404).send('Not found');
      res.status(500).send('Internal server error');
    }
  }

  private async post(req: Request, res: Response) {
    try {
      const doc = req.body;
      const createdDoc = await this.repository.create(doc);
      res.status(201).json(createdDoc);

    } catch (err: any) {
      res.status(500).send('Internal server error');
    }
  }

  private async put(req: Request, res: Response) {
    try {
      const doc = req.body;
      const updatedDoc = await this.repository.update(doc);
      res.status(204).json(updatedDoc);

    } catch (err: any) {
      res.status(500).send('Internal server error');
    }
  }

  private async del(req: Request, res: Response) {
    try {
      const id = req.params?.id;
      if (!id) {
        res.status(400).send('/:id parameter is required');
      }
      const deletedId = await this.repository.delete(id);
      res.status(204).json(deletedId);

    } catch (err: any) {
      res.status(500).send('Internal server error');
    }
  }
}