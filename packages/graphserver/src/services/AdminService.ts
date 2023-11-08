import {Database} from 'arangojs';
import {inject, injectable} from 'inversify';
import {Client} from 'minio';

import {CollectionNames, EdgeNames} from '../config/collections';
import { SENDGRID_INQUIRE_TEMPLATE_ID, sgMail } from '../config/config';
import {IAdminService} from './interfaces';
import { DynamicTemplateData } from './interfaces/IAdminService';

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject('Database') private readonly db: Database,
    @inject('MinioClient') private readonly minio: Client,
  ) {}

  public async validateAndCreateCollectionsAndEdges(): Promise<void> {
    const collectionNames = Object.values(CollectionNames);
    const edgeNames = Object.values(EdgeNames);
    collectionNames.map(async collectionName => {
      await this.ensureCollectionExists(collectionName);
      
    });

    edgeNames.map(async edgeName => {
      await this.ensureEdgeExists(edgeName);
    });
  }

  // METHOD NOT IMPLEMENTED
  // eslint-disable-next-line class-methods-use-this
  public async approveGalleryById(galleryId: string): Promise<string> {
    
    return galleryId
  }

  public async addMinioBucker(bucketName: string): Promise<string> {
    try {
      await this.minio.makeBucket(bucketName);
      return `added ${bucketName}`;
    } catch (error: any) {
      throw new Error(`failed to add ${bucketName}: ${error.message}`);
    }
  }


  public async addApprovedGallerySDL(sdl: string): Promise<string> {
    const query = `
        FOR doc IN ${CollectionNames.GalleryApprovals}
        LET updatedArray = (@sdl NOT IN doc.approved) ? APPEND(doc.approved, [@sdl]) : doc.approved
        UPDATE doc WITH {
            approved: updatedArray
        } IN ${CollectionNames.GalleryApprovals}
        RETURN doc
    `;

    const cursor = await this.db.query(query, {sdl});
    const results = await cursor.next();
    if (results?.approved.includes(sdl)) {
      return `added ${sdl}`;
    } 
      return `failed to add ${sdl}`;
    
  }



  // eslint-disable-next-line class-methods-use-this
  public async sgSendEmailInquireTemplate({to, from, dynamicTemplateData} 
    : 
    {to: string, from: string, dynamicTemplateData: DynamicTemplateData}
    ): Promise<string>{
    try {
      const msg = {
          to,
          from: from || 'tj@darta.art',
          templateId: SENDGRID_INQUIRE_TEMPLATE_ID,
          content: [
            {
              type: 'text/html',
              value: 'text',
            },
          ] as any,
          dynamicTemplateData,
      }

      await sgMail.send(msg);
      return 'sent'
  } catch (error: any) {
      throw new Error(`failed to send email: ${error?.message}`)
  }
  }

  // eslint-disable-next-line class-methods-use-this
  public async sgSendEmail({to, from, subject, text, html} 
    : 
    {to: string, from: string, subject: string, text: string, html?: string}
    ): Promise<string>{
    try {
      const msg = {
          to,
          from: from || 'tj@darta.art',
          subject,
          text,
          html,
      };

      await sgMail.send(msg);
      return 'sent'
  } catch (error: any) {
      throw new Error(`failed to send email: ${error?.message}`)
  }
  }

  private async ensureCollectionExists(collectionName: string) {
    try {
      await this.db.collection(collectionName).get();
    } catch (err: any) {
      if (err.isArangoError && err.errorNum === 1203) {
        // ARANGO_DATA_SOURCE_NOT_FOUND
        await this.db.createCollection(collectionName);
      } else {
        throw err;
      }
    }
  }

  private async ensureEdgeExists(collectionName: string) {
    try {
      await this.db.collection(collectionName).get();
    } catch (err: any) {
      if (err.isArangoError && err.errorNum === 1203) {
        // ARANGO_DATA_SOURCE_NOT_FOUND
        await this.db.createEdgeCollection(collectionName);
      } else {
        throw err;
      }
    }
  }
}
