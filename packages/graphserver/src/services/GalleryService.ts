import { injectable, inject } from 'inversify';
import { Database } from 'arangojs';
import { IGalleryService } from './IGalleryService';
import { Gallery } from 'src/models/GalleryModel';


@injectable()
export class GalleryService implements IGalleryService {
  constructor(@inject('Database') private readonly db: Database) {}

  public async createGalleryProfile(uuid: string): Promise<void> {
    const galleryCollection = this.db.collection('galleries');
    const newGallery: any = {
        uuids: [uuid], 
        primaryUUID: uuid,
      };
    
      const metaData = await galleryCollection.save(newGallery);
      return { ...newGallery, _id: metaData._id, _key: metaData._key, _rev: metaData._rev };
  }
  public async readGalleryProfile(uuid: string): Promise<Gallery | null>{
    const query = `
    FOR gallery IN galleries
      FILTER @userUUID IN gallery.uuids
      RETURN gallery
  `;
  const cursor = await this.db.query(query, { userUUID: uuid });
  const gallery: Gallery | null = await cursor.next(); // Get the first result

  return gallery;
  }
  public async editGalleryProfile(): Promise<void>{

  }
  public async deleteGalleryProfile(): Promise<void>{

  }

  public async verifyQualifyingGallery(domain: string): Promise<boolean>{
    const query = `
        FOR gallery IN galleries-approved
        FILTER @domain IN approved
        RETURN gallery
    `;
    const cursor = await this.db.query(query, { domain });
    const isApproved: boolean | null = await cursor.next(); // Get the first result

    if (isApproved){
        return true
    }
    return false
  }

}


