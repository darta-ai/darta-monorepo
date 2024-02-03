import { ExhibitionPreviewAdmin } from '@darta-types/dist';
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

  public async listAllExhibitionsForAdmin(): Promise<ExhibitionPreviewAdmin[]> {
    try {

      const getExhibitionPreviewQuery = `
      WITH ${CollectionNames.Exhibitions}, ${CollectionNames.Galleries}, ${CollectionNames.Artwork}
      LET exhibitions = (
        FOR exhibition IN ${CollectionNames.Exhibitions}
        SORT exhibition.exhibitionDates.exhibitionStartDate.value DESC
        RETURN exhibition
      )
      
      FOR exhibition IN exhibitions
          LET gallery = (
              FOR g, edge IN 1..1 INBOUND exhibition ${EdgeNames.FROMGalleryTOExhibition}
                  RETURN g
          )[0]
          LET artworks = (
              FOR artwork, artworkEdge IN 1..1 OUTBOUND exhibition ${EdgeNames.FROMCollectionTOArtwork}
              SORT artworkEdge.exhibitionOrder ASC
              LIMIT 2
              RETURN {
                  [artwork._id]: {
                      _id: artwork._id,
                      artworkImage: artwork.artworkImage,
                      artworkTitle: artwork.artworkTitle
                  }
              }
          )
          
      RETURN {
          exhibitionId: exhibition._id,
          isPublished: exhibition.isPublished,
          hasArtwork: LENGTH(artworks) > 0,
          galleryId: gallery._id,
          exhibitionDuration: exhibition.exhibitionDates,
          openingDate: {value: exhibition.exhibitionDates.exhibitionStartDate.value},
          closingDate: {value: exhibition.exhibitionDates.exhibitionEndDate.value},
          galleryName: gallery.galleryName,
          galleryWebsite: gallery.galleryWebsite,
          exhibitionTitle: exhibition.exhibitionTitle,
          exhibitionArtist: exhibition.exhibitionArtist,
          exhibitionLocation: {
              exhibitionLocationString: exhibition.exhibitionLocation.locationString,
              coordinates: exhibition.exhibitionLocation.coordinates
          },
          receptionDates: exhibition.receptionDates
      }
      `
      const cursor = await this.db.query(getExhibitionPreviewQuery);
      const results = await cursor.all();
      
      // filter out duplicate exhibitions by location 
      const filteredResults = results.filter((exhibition, index, self) => 
        index === self.findIndex((t) => (
          t.exhibitionLocation.exhibitionLocationString.value === exhibition.exhibitionLocation.exhibitionLocationString.value
        ))
      )


      return filteredResults;
    } catch (error: any) {
      throw new Error(`failed to list all exhibitions: ${error.message}`);
    }
  }
}
