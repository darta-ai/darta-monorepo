import {Database} from 'arangojs';
import {inject, injectable} from 'inversify';
import {Client} from 'minio';

import {IRecommendationService} from './interfaces';

@injectable()
export class RecommendationService implements IRecommendationService {
  constructor(
    @inject('Database') private readonly db: Database,
    @inject('MinioClient') private readonly minio: Client,
  ) {}

  public async recommendArtworkToUser(): Promise<string[]>{
    this.minio.makeBucket('testbucket', 'us-east-1', () => {
    });
    return []
  }
}
