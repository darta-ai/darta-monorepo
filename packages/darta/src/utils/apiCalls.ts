import { Artwork, GalleryPreview, USER_ARTWORK_EDGE_RELATIONSHIP } from "@darta-types/dist";
import { createUserArtworkRelationship, deleteUserArtworkRelationship, listUserArtworkAPIRelationships } from "../api/artworkRoutes";
import { createDartaUserFollowGallery, deleteDartaUserFollowGallery, listDartaUserFollowsGallery } from "../api/userRoutes";
import {listArtworksToRate} from "../api/recommenderRoutes";
import auth from '@react-native-firebase/auth';

export const createArtworkRelationshipAPI = async ({artworkId, action} :{artworkId: string;action: USER_ARTWORK_EDGE_RELATIONSHIP;}) => {
    try{
        const uid = auth().currentUser?.uid;
        if (!uid) return null;
        return await createUserArtworkRelationship({uid, action, artworkId});
    } catch (error){
        console.log(error)
        throw new Error(error)
    }
}

export const deleteArtworkRelationshipAPI = async ({artworkId,action} :{artworkId: string;action: USER_ARTWORK_EDGE_RELATIONSHIP}) => {
    try{
        const uid = auth().currentUser?.uid;
        if (!uid) return null;
        return await deleteUserArtworkRelationship({uid, action, artworkId});
    } catch (error){
        console.log(error)
        throw new Error(error)
    }
}

export const createGalleryRelationshipAPI = async ({galleryId} :{galleryId: string;}) => {
    try{
        const uid = auth().currentUser?.uid
        if (!uid) return null;
        return await createDartaUserFollowGallery({uid, galleryId});
    } catch (error){
        console.log(error)
        throw new Error(error)
    }
}

export const deleteGalleryRelationshipAPI = async ({galleryId} :{galleryId: string;}) => {
    try{
        const uid = auth().currentUser?.uid;
        if (!uid) return null;
        return await deleteDartaUserFollowGallery({uid, galleryId});
    } catch (error){
        console.log(error)
        throw new Error(error)
    }
}

export const listUserArtworkAPI = async ({action, limit} :{action: USER_ARTWORK_EDGE_RELATIONSHIP, limit: number}): Promise<{[key: string]: Artwork} | void> => {
    try{
        const uid = auth().currentUser?.uid;
        if (uid) {
        return await listUserArtworkAPIRelationships({uid, action, limit});
        }
    } catch (error){
        console.log(error)
        throw new Error(error)
    }
}

export const listGalleryRelationshipsAPI = async (): Promise<GalleryPreview[] | void> => {
    try{
        const uid = auth().currentUser?.uid;
        if (uid) {
        return await listDartaUserFollowsGallery({uid});
        }
    } catch (error){
        console.log(error)
        throw new Error(error)
    }
}

export const listArtworksToRateAPI = async ({startNumber, endNumber} :{startNumber: number; endNumber: number}): Promise<{[key: string] : Artwork} | void> => {
    try{
        const uid = auth().currentUser?.uid;
        if (uid) {
        return await listArtworksToRate({uid, startNumber, endNumber});
        }
    } catch (error){
        console.log(error)
        throw new Error(error)
    }
}