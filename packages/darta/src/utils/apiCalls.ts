import { Artwork, GalleryPreview, USER_ARTWORK_EDGE_RELATIONSHIP } from "@darta-types/dist";
import { createUserArtworkRelationship, deleteUserArtworkRelationship, listUserArtworkRelationships } from "../api/artworkRoutes";
import { createDartaUserFollowGallery, deleteDartaUserFollowGallery, listDartaUserFollowsGallery } from "../api/userRoutes";
import auth from '@react-native-firebase/auth';

export const createArtworkRelationship = async ({artworkId, action} :{artworkId: string;action: USER_ARTWORK_EDGE_RELATIONSHIP;}) => {
    try{
        const uid = auth().currentUser?.uid;
        if (!uid) return null;
        return await createUserArtworkRelationship({uid, action, artworkId});
    } catch (error){
        console.log(error)
        throw new Error(error)
    }
}

export const createGalleryRelationship = async ({galleryId} :{galleryId: string;}) => {
    try{
        const uid = auth().currentUser?.uid
        if (!uid) return null;
        return await createDartaUserFollowGallery({uid, galleryId});
    } catch (error){
        console.log(error)
        throw new Error(error)
    }
}

export const deleteGalleryRelationship = async ({galleryId} :{galleryId: string;}) => {
    try{
        const uid = auth().currentUser?.uid;
        if (!uid) return null;
        return await deleteDartaUserFollowGallery({uid, galleryId});
    } catch (error){
        console.log(error)
        throw new Error(error)
    }
}

export const deleteArtworkRelationship = async ({artworkId,action} :{artworkId: string;action: USER_ARTWORK_EDGE_RELATIONSHIP}) => {
    try{
        const uid = auth().currentUser?.uid;
        if (!uid) return null;
        return await deleteUserArtworkRelationship({uid, action, artworkId});
    } catch (error){
        console.log(error)
        throw new Error(error)
    }
}

export const listUserArtwork = async ({action, limit} :{action: USER_ARTWORK_EDGE_RELATIONSHIP, limit: number}): Promise<{[key: string]: Artwork} | void> => {
    try{
        const uid = auth().currentUser?.uid;
        if (uid) {
        return await listUserArtworkRelationships({uid, action, limit});
        }
    } catch (error){
        console.log(error)
        throw new Error(error)
    }
}

export const listGalleryRelationships = async (): Promise<GalleryPreview[] | void> => {
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