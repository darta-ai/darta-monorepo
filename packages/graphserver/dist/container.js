"use strict";
// import { Database } from 'arangojs';
// // import * as fs from 'fs';
// import https from 'https';
// import { Container } from 'inversify';
// // import path from 'path';
// import { config } from './config';
// const agent = new https.Agent({
//   rejectUnauthorized: false,
// });
// const container = new Container();
// const arangoContainer = container.bind<Database>('Database').toConstantValue(
//   new Database({
//     url: config.arango.url!,
//     databaseName: config.arango.database!,
//     auth: {
//       username: config.arango.user!,
//       password: '',
//     },
//     agent,
//   }),
// );
// export {
//   container,
//   arangoContainer,
// };
