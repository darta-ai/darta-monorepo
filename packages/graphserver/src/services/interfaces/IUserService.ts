import { Node } from 'src/models/models';


export interface IUserService {
  createGalleryUserAndEdge({uid, galleryId, email, phoneNumber, gallery, relationship, validated} : {uid: string, galleryId: string, email : string, phoneNumber :string, gallery:string, relationship: string, validated: boolean}): Promise<any>    
  createGalleryUser({email, uid} : {email: string, uid: string}): Promise<boolean>;
    readGalleryUser({uid} : {uid: string}): Promise<Node | null>
    deleteGalleryUser(): Promise<boolean>;
    editGalleryUserEmailAddress({uid, emailAddress} : {uid: string, emailAddress: string}): Promise<boolean>;

    createGalleryEdge({galleryId, uid, relationship} : {galleryId: string, uid: string, relationship: string}): Promise<boolean>
    readGalleryEdgeRelationship({uid} : {uid: string}): Promise<string | boolean>
    editGalleryEdge({galleryId, uid, relationship} : {galleryId: string, uid: string, relationship: string}): Promise<boolean>


    validateGalleryRelationship({galleryId, uid} : {galleryId: string, uid: string}): Promise<boolean>
  }
  