import { injectable, inject } from 'inversify';
import { Database } from 'arangojs';
import { IGalleryService } from './interfaces/IGalleryService';
import { Gallery, City} from 'src/models/GalleryModel';
import { GalleryBase, IGalleryProfileData, GalleryAddressFields, ImageFields } from '@darta/types';
import { ImageController } from 'src/controllers/ImageController';
import {CollectionNames, EdgeNames} from '../config/collections'

const BUCKET_NAME= "logo"

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
    const galleryCollection = this.db.collection(`${CollectionNames.Galleries}`);
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
    const galleryQuery = `
    WITH ${CollectionNames.Galleries}
    FOR gallery IN ${CollectionNames.Galleries}
    FILTER @userUUID IN gallery.uuids
    RETURN gallery
  `;

  let gallery;

  // get gallery
  try{
    const cursor = await this.db.query(galleryQuery, { userUUID: uuid });
    gallery = await cursor.next(); // Get the first result
  } catch(error){
    console.log(error)
  }


  //get city
  const cityQuery = `
  WITH Galleries, Cities
  FOR cityViaEdge IN 1..1 OUTBOUND @galleryId ${EdgeNames.GalleryToCity}
    RETURN cityViaEdge
`
  let cityValue;

  try{
    const cityCursor = await this.db.query(cityQuery, { galleryId: gallery._id });
    cityValue = await cityCursor.next(); // Get the first result
  } catch(error: any){
  }

  // get gallery image
  const {galleryLogo} = gallery

  let url;
    if (galleryLogo?.bucketName && galleryLogo?.fileName){
      try{
        url = await this.imageController.processGetFile({bucketName: galleryLogo?.bucketName, fileName: galleryLogo?.fileName})
      } catch(error){
        console.log(error)
      }
    }
  return {
    ...gallery, 
    galleryLogo : {
      value: url
    }
  };
  }
  
  public async editGalleryProfile({user, data}: {user: any, data: IGalleryProfileData}): Promise<Gallery | null> {

    const { galleryLogo, ...galleryData } = data;

    const galleryKey = await this.getGalleryId({uuid: user?.user_id})

    const {currentGalleryLogo} = await this.getGalleryLogo({key: galleryKey})

    let fileName:string = crypto.randomUUID()
    if (currentGalleryLogo?.galleryLogo?.fileName){
      fileName = currentGalleryLogo.galleryLogo.fileName
    }

    let galleryLogoResults
    if (galleryLogo?.fileData){
      try{
        galleryLogoResults = await this.imageController.processUploadImage({fileBuffer: galleryLogo?.fileData, fileName, bucketName: BUCKET_NAME})
      } catch (error){
        console.error("error uploading image:", error)
      }
    }

    // Update or Insert gallery
    const findGalleryQuery = `
    WITH ${CollectionNames.Galleries}
    FOR gallery IN ${CollectionNames.Galleries}
      FILTER @userUUID IN gallery.uuids
      UPDATE @data IN ${CollectionNames.Galleries}
      RETURN NEW
  `;

    const cursor = await this.db.query(findGalleryQuery, { userUUID: user.user_id, data: {...galleryData, galleryLogo: {
      fileName: galleryLogoResults?.fileName, 
      bucketName: galleryLogoResults?.bucketName, 
      value: galleryLogoResults?.value
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
            UPDATE {} IN ${CollectionNames.Cities}
            RETURN NEW
          `;

          const cityCursor = await this.db.query(upsertCityQuery, { cityValue });
          const city: City = await cityCursor.next(); // Assuming City is a type

          // Check if an edge between the gallery and this city already exists
          const checkEdgeQuery = `
          FOR edge IN ${EdgeNames.GalleryToCity}
          FILTER edge._from == @galleryId AND edge._to == @cityId
          RETURN edge
          `;

          const edgeCursor = await this.db.query(checkEdgeQuery, { galleryId: gallery._id, cityId: city._id });
          const existingEdge = await edgeCursor.next();

            // If there's no existing edge, create a new one
            if (!existingEdge) {
                const createEdgeQuery = `
                    INSERT { _from: @galleryId, _to: @cityId } INTO ${EdgeNames.GalleryToCity}
                `;
                await this.db.query(createEdgeQuery, { galleryId: gallery._id, cityId: city._id });
            }
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
        FOR gallery IN ${CollectionNames.GalleryApprovals}
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
          FOR gallery IN ${CollectionNames.GalleryApprovals}
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
            FOR gallery IN ${CollectionNames.GalleryApprovals}
            UPDATE gallery WITH { ${awaitingApprovalField}: PUSH(gallery.${awaitingApprovalField}, @domain) } INTO ${CollectionNames.GalleryApprovals}
            RETURN NEW
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

  public async getGalleryId({uuid}: {uuid:string}): Promise<any>{
    const findGalleryKey = `
    FOR gallery IN ${CollectionNames.Galleries}
    FILTER @userUUID IN gallery.uuids
    RETURN gallery._key
    
  `;
  const cursor = await this.db.query(findGalleryKey, { userUUID: uuid });

  const key: string = await cursor.next();
  return key
  }

  public async getGalleryLogo({key}: {key:string}): Promise<any>{
    const findGalleryKey = `
    LET doc = DOCUMENT(CONCAT("Galleries/", @key))
    RETURN {
        galleryLogo: doc.galleryLogo
    }
  `;
  const cursor = await this.db.query(findGalleryKey, { key });

  const currentGalleryLogo: ImageFields = await cursor.next();
  return {currentGalleryLogo}
  }

}


