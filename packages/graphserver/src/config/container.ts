import {Database} from 'arangojs';
import https from 'https';
import {Container} from 'inversify';
import {Client as MinioClient} from 'minio';

import * as Controllers from '../controllers';
import * as Services from '../services';
import {config} from './config';

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const container = new Container();

const TYPES = {
  Database: 'Database',
  MinioClient: 'MinioClient',
  IGalleryService: 'IGalleryService',
  GalleryController: 'GalleryController',
  ImageController: 'ImageController',
  IImageService: 'IImageService',
  ArtworkController: 'ArtworkController',
  IArtworkService: 'IArtworkService',
  AdminController: 'AdminController',
  IAdminService: 'IAdminService',
  EdgeService: 'EdgeService',
  IEdgeService: 'IEdgeService',
  NodeService: 'NodeService',
  INodeService: 'INodeService',
  IUserService: 'IUserService',
  UserController: 'UserController',
  IExhibitionService: 'IExhibitionService',
  ExhibitionController: 'ExhibitionController',
};

const arangoContainer = container
  .bind<Database>(TYPES.Database)
  .toConstantValue(
    new Database({
      url: config.arango.url!,
      databaseName: config.arango.database!,
      auth: {
        username: config.arango.user!,
        password: config.arango.password,
      },
      agent,
    }),
  );

const minioContainer = container
  .bind<MinioClient>(TYPES.MinioClient)
  .toConstantValue(
    new MinioClient({
      endPoint: config.minio.endpoint!,
      port: parseInt(config.minio.port!, 10),
      useSSL: config.minio.useSSL === 'true',
      accessKey: config.minio.accessKey!,
      secretKey: config.minio.secretKey!,
      region: 'us-east-1',
    }),
  );

// Bind services
container
  .bind<Services.IGalleryService>(TYPES.IGalleryService)
  .to(Services.GalleryService);
container
  .bind<Services.IImageService>(TYPES.IImageService)
  .to(Services.ImageService);
container
  .bind<Services.IArtworkService>(TYPES.IArtworkService)
  .to(Services.ArtworkService);
container
  .bind<Services.IAdminService>(TYPES.IAdminService)
  .to(Services.AdminService);
container
  .bind<Services.IEdgeService>(TYPES.IEdgeService)
  .to(Services.EdgeService);
container
  .bind<Services.INodeService>(TYPES.INodeService)
  .to(Services.NodeService);
container
  .bind<Services.IUserService>(TYPES.IUserService)
  .to(Services.UserService);
container
  .bind<Services.IExhibitionService>(TYPES.IExhibitionService)
  .to(Services.ExhibitionService);

// Bind controllers
container
  .bind<Controllers.GalleryController>(TYPES.GalleryController)
  .to(Controllers.GalleryController);
container
  .bind<Controllers.ImageController>(TYPES.ImageController)
  .to(Controllers.ImageController);
container
  .bind<Controllers.ArtworkController>(TYPES.ArtworkController)
  .to(Controllers.ArtworkController);
container
  .bind<Controllers.AdminController>(TYPES.AdminController)
  .to(Controllers.AdminController);
container
  .bind<Controllers.UserController>(TYPES.UserController)
  .to(Controllers.UserController);
container
  .bind<Controllers.ExhibitionController>(TYPES.ExhibitionController)
  .to(Controllers.ExhibitionController);

export {arangoContainer, container, minioContainer, TYPES};
