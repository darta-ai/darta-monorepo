import { injectable, inject } from 'inversify';
import { Database } from 'arangojs';
import { IGalleryService } from './IGalleryService';
import { Gallery } from 'src/models/GalleryModel';
import { GalleryBase, IGalleryProfileData } from '@darta/types';

@injectable()
export class GalleryService implements IGalleryService {
  constructor(@inject('Database') private readonly db: Database) {}

  public async createGalleryProfile(
    { primaryUUID,
    primaryOwnerPhone,
    galleryName, 
    signUpWebsite,
    primaryOwnerEmail, 
    isValidated } : GalleryBase): Promise<void> {
    const galleryCollection = this.db.collection('galleries');
    const newGallery: any = {
        uuids: [primaryUUID], 
        primaryUUID,
        primaryOwnerPhone,
        primaryOwnerEmail,
        galleryName,
        signUpWebsite, 
        isValidated
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
  
  public async editGalleryProfile({user, data}: {user: any, data: IGalleryProfileData}): Promise<Gallery | null>{
    const query = `
    FOR gallery IN galleries
      FILTER @userUUID IN gallery.uuids
      UPDATE gallery WITH @data IN galleries
      RETURN gallery
  `;
  const cursor = await this.db.query(query, { userUUID: user.user_id, ...data });
  const gallery: Gallery | null = await cursor.next(); // Get the first result

  return gallery;
  }

  public async deleteGalleryProfile(): Promise<void>{

  }

  public async verifyQualifyingGallery(email: string): Promise<boolean> {
      const isGmail = email.endsWith('@gmail.com');
      const domain = isGmail ? email : email.substring(email.lastIndexOf("@") + 1);
    try {
      // Define the query for checking the approved array
      const query = `
        FOR gallery IN galleryApprovals
        FILTER @domain IN gallery.approved
        RETURN gallery
      `;
      const cursor = await this.db.query(query, { domain });
      const isValidated: boolean | null = await cursor.next(); // Get the first result
      if (isValidated) {
        return true;
      } else {
        // Define the query for checking the awaiting approval array
        const query2 = `
          FOR gallery IN galleryApprovals
          FILTER @domain IN gallery.${isGmail ? 'awaitingApprovalGmail' : 'awaitingApproval'}
          RETURN gallery
        `;
        const cursor2 = await this.db.query(query2, { domain });
        const isAwaiting: boolean | null = await cursor2.next(); // Get the first result
        if (isAwaiting) {
          return false;
        } else {
          // Save the domain to the awaiting approval array
          const awaitingApprovalField = isGmail ? 'awaitingApprovalGmail' : 'awaitingApproval';
          const query3 = `
            FOR gallery IN galleryApprovals
            UPDATE gallery WITH { ${awaitingApprovalField}: PUSH(gallery.${awaitingApprovalField}, @domain) } INTO galleryApprovals
          `;
          await this.db.query(query3, { domain });
          console.log('sent!', query3, domain)
          return false;
        }
      }
    } catch (error: any) {
      console.log(error);
      return false;
    }
  }  
}


