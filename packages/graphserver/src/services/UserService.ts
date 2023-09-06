import { injectable, inject } from 'inversify';
import { Database } from 'arangojs';
import { CollectionNames, EdgeNames } from 'src/config/collections';
import { IUserService, INodeService, IGalleryService, IEdgeService } from './interfaces';
import { Node } from 'src/models/models';


@injectable()
export class UserService implements IUserService {
  constructor(
    @inject('Database') private readonly db: Database,
    @inject('IEdgeService') private readonly edgeService: IEdgeService,
    @inject('INodeService') private readonly nodeService: INodeService,
    @inject('IGalleryService') private readonly galleryService: IGalleryService
    ) {}


    public async createGalleryUserAndEdge({uid, galleryId, email, phoneNumber, gallery, relationship, validated} : {uid: string, galleryId: string, email : string, phoneNumber :string, gallery:string, relationship: string, validated: boolean}): Promise<any>{

        let userId;
        try{
            userId = await this.createGalleryUser({uid, email, phoneNumber, gallery, validated})
        } catch (error) {
            console.log(error)
        }

        let edgeResults;

        try{
            edgeResults = await this.createGalleryEdge({
                galleryId,
                uid,
                relationship
            })
        } catch (error) {
            console.log(error)
        }

    }

    public async createGalleryUser({email, uid, phoneNumber, gallery}: {email: string, uid: string, phoneNumber: string, gallery: string, validated: boolean}): Promise<boolean>{
        try{
            const results = await this.nodeService.upsertNode({
                collectionName: CollectionNames.GalleryUsers, 
                key: uid, 
                data: {
                    value: email,
                    uid,
                    phone: phoneNumber ?? null, 
                    gallery: gallery ?? null,
                }
            })
            console.log(results)
            return true
        } catch (error) {
            console.log('error at create gallery user',error)
        }
        return false
    }

    public async readGalleryUser({uid} : {uid: string}): Promise<Node | null>{
        try{
            const results = await this.nodeService.getNode({
                collectionName : CollectionNames.GalleryUsers, 
                    key: `${CollectionNames.GalleryUsers}/${uid}`
                })
            if (results) {
                return results
            } 
        } catch (error){
            console.log('error at read gallery user',error)
        }
        return null
    }
    public async deleteGalleryUser(): Promise<boolean>{



        return false
    }

    // only edits the email address
    public async editGalleryUserEmailAddress({uid, emailAddress} : {uid: string, emailAddress: string}): Promise<boolean>{
        
        return false
    }



    public async createGalleryEdge({galleryId, uid, relationship} : {galleryId: string, uid: string, relationship: string}): Promise<boolean>{
        console.log({galleryId, uid, relationship})

        const standarizedGalleryId = galleryId.includes(CollectionNames.Galleries) ? galleryId : `${CollectionNames.Galleries}/${galleryId}`
        const standarizedUserId = uid.includes(CollectionNames.GalleryUsers) ? uid : `${CollectionNames.GalleryUsers}/${uid}`

        try{
            await this.edgeService.upsertEdge({
                edgeName: EdgeNames.FROMUserTOGallery,
                from: standarizedUserId,
                to: standarizedGalleryId,
                data: {
                    value: relationship
                }
            })
            return true
        }catch (error) {
            console.log('error at create gallery edge', error)
        }
        
        return false;
    }
    public async readGalleryEdgeRelationship({uid} : {uid: string}): Promise<string | boolean> {
        try {
            const results = await this.edgeService.getEdgeWithFrom({
                edgeName: EdgeNames.FROMUserTOGallery,
                from: `${CollectionNames.GalleryUsers}/${uid}`
            })
            console.log(results)
            return results
        } catch(error){
            console.log('error at read gallery relationship edge',error)
        }

        return false
    }
    public async editGalleryEdge({galleryId, uid, relationship} : {galleryId: string, uid: string, relationship: string}): Promise<boolean> {

        try{
            const results = await this.edgeService.updateEdge({
                edgeName: EdgeNames.FROMUserTOGallery,
                from: `${CollectionNames.GalleryUsers}/${uid}`,
                to: `${CollectionNames.Galleries}/${galleryId}`,
                data: {
                    value: relationship
                }
            })
            console.log(results)
            return true
        }catch (error) {
            console.log('error at create gallery edge',error)
        }
        return false
    }

    public async validateGalleryRelationship({galleryId, uid} : {galleryId: string, uid: string}): Promise<boolean>{
        const results = await this.readGalleryEdgeRelationship({uid})
        console.log(results)
        return true
    }



}



