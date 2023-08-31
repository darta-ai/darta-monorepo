import { injectable, inject } from 'inversify';
import { Database } from 'arangojs';
import { IGalleryService } from './interfaces/IGalleryService';
import { Gallery, City} from 'src/models/GalleryModel';
import { GalleryBase, IGalleryProfileData, GalleryAddressFields } from '@darta/types';
import { ImageController } from 'src/controllers/ImageController';

const BUCKET_NAME= "gallery-logo-bucket"

@injectable()
export class GalleryService implements IGalleryService {
  constructor(
    @inject('Database') private readonly db: Database,
    @inject('ImageController') private readonly imageController: ImageController
    ) {}

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
    WITH cities
    FOR gallery IN galleries
    FILTER @userUUID IN gallery.uuids
    FOR galleriesToCity, edge IN 1..1 OUTBOUND gallery galleryToCity
    RETURN {
        gallery: gallery,
        city: galleriesToCity
    }
  `;

  const cursor = await this.db.query(query, { userUUID: uuid });
  const gallery: Gallery | null | any = await cursor.next(); // Get the first result

  const {bucketName, fileName} = gallery.gallery.galleryLogo
  const url = this.imageController.processGetFile({bucketName, fileName})
  return gallery.gallery;
  }
  
  public async editGalleryProfile({user, data}: {user: any, data: IGalleryProfileData}): Promise<Gallery | null> {

    const { galleryLogo, ...galleryData } = data;

    let galleryLogoResults
    if (galleryLogo?.fileData){
      try{
        galleryLogoResults = await this.imageController.processFile({fileBuffer: galleryLogo?.fileData, fileName: `${crypto.randomUUID()}-${galleryLogo?.fileName}`, bucketName: BUCKET_NAME})
      } catch (error){
        console.error("error uploading image:", error)
      }
    }

    // Update or Insert gallery
    const findGalleryQuery = `
    FOR gallery IN galleries
      FILTER @userUUID IN gallery.uuids
      UPDATE @data IN galleries
      RETURN gallery
  `;

    const cursor = await this.db.query(findGalleryQuery, { userUUID: user.user_id, data: {...galleryData, galleryLogo: {
      fileName: galleryLogoResults?.fileName, 
      bucketName: galleryLogoResults?.bucketName
    }} });
    const gallery: Gallery | null = await cursor.next();
    if(gallery){
    // Dynamically check for galleryLocationX properties
    for (let i = 0; i < 5; i++){
      let key = `galleryLocation${i}`
      if (gallery[key as keyof Gallery]){
        const cityValue = gallery[key as keyof GalleryAddressFields] && gallery[key as keyof GalleryAddressFields]?.city?.value;
        if (cityValue) {
          // Check if city exists and upsert it
          const upsertCityQuery = `
            UPSERT { value: @cityValue }
            INSERT { value: @cityValue }
            UPDATE {} IN cities
            RETURN NEW
          `;

          const cityCursor = await this.db.query(upsertCityQuery, { cityValue });
          const city: City = await cityCursor.next(); // Assuming City is a type

          // Create an edge between the gallery and city for this location
          const createEdgeQuery = `
            INSERT { _from: @galleryId, _to: @cityId } INTO galleryToCity
          `;
          
            await this.db.query(createEdgeQuery, { galleryId: gallery._id, cityId: city._id });
          }
        }
      }
    }

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
          return false;
        }
      }
    } catch (error: any) {
      console.log(error);
      return false;
    }
  }  
}


