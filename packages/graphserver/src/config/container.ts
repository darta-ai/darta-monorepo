import {Database} from 'arangojs';
// import fs from 'fs';
import https from 'https';
import {Container} from 'inversify';
import {Client as MinioClient} from 'minio';

// import path from 'path';
import * as Controllers from '../controllers';
import * as Services from '../services';
import {config} from './config';

const agent = new https.Agent({
  rejectUnauthorized: false,
});

// const certPath = path.join(__dirname, '../assets/cluster-ca.crt');

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
  IEdgeService: 'IEdgeService',
  INodeService: 'INodeService',
  IUserService: 'IUserService',
  IPushService: 'IPushService',
  IExhibitionService: 'IExhibitionService',
  IRecommenderService: 'IRecommenderService',
  IListService: 'IListService',
  IEmailService: 'IEmailService',
  IScrapeService: 'IScrapeService',
  EdgeService: 'EdgeService',
  NodeService: 'NodeService',
  UserController: 'UserController',
  ExhibitionController: 'ExhibitionController',
  LocationController: 'LocationController',
  RecommenderController: 'RecommenderController',
  ListController: 'ListController',
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
      region: 'us-central-1',
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
container
  .bind<Services.IEmailService>(TYPES.IEmailService)
  .to(Services.EmailService);
container
  .bind<Services.IRecommenderService>(TYPES.IRecommenderService)
  .to(Services.RecommenderService);
container
  .bind<Services.IListService>(TYPES.IListService)
  .to(Services.ListService);

container
  .bind<Services.IScrapeService>(TYPES.IScrapeService)
  .to(Services.ScrapeService);
container
  .bind<Services.PushService>(TYPES.IPushService)
  .to(Services.PushService);

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
container
  .bind<Controllers.LocationController>(TYPES.LocationController)
  .to(Controllers.LocationController);
container
.bind<Controllers.RecommenderController>(TYPES.RecommenderController)
container
.bind<Controllers.ListController>(TYPES.ListController)

export {arangoContainer, container, minioContainer, TYPES};
