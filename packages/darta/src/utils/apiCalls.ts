import { Artwork, GalleryPreview, Images, MobileUser, NewList, USER_ARTWORK_EDGE_RELATIONSHIP } from "@darta-types";
import { createUserArtworkRelationship, deleteUserArtworkRelationship, listUserArtworkAPIRelationships } from "../api/artworkRoutes";
import { createDartaUserFollowGallery, createUserVisitedGallery, deleteDartaUserFollowGallery, editDartaUserAccount, listDartaUserFollowsGallery } from "../api/userRoutes";
import {listArtworksToRate, listArtworksToRateStatelessRandomSampling} from "../api/recommenderRoutes";
import auth from '@react-native-firebase/auth';
import { createListForUser, listUserLists } from "../api/listRoutes";

export const createArtworkRelationshipAPI = async ({artworkId, action} :{artworkId: string;action: USER_ARTWORK_EDGE_RELATIONSHIP;}) => {
    try{
        const uid = auth().currentUser?.uid;
        if (!uid) return null;
        return await createUserArtworkRelationship({uid, action, artworkId});
    } catch (error){
        throw new Error(error)
    }
}

export const deleteArtworkRelationshipAPI = async ({artworkId,action} :{artworkId: string;action: USER_ARTWORK_EDGE_RELATIONSHIP}) => {
    try{
        const uid = auth().currentUser?.uid;
        if (!uid) return null;
        return await deleteUserArtworkRelationship({uid, action, artworkId});
    } catch (error){
        throw new Error(error)
    }
}

export const createGalleryRelationshipAPI = async ({galleryId} :{galleryId: string;}) => {
    try{
        const uid = auth().currentUser?.uid
        if (!uid) return null;
        return await createDartaUserFollowGallery({uid, galleryId});
    } catch (error){
        throw new Error(error)
    }
}

export const galleryVisitorAPI = async ({galleryId} :{galleryId: string;}) => {
    try{
        const uid = auth().currentUser?.uid
        if (!uid) return null;
        return await createUserVisitedGallery({uid, galleryId});
    } catch (error){
        throw new Error(error)
    }
}

export const deleteGalleryRelationshipAPI = async ({galleryId} :{galleryId: string;}) => {
    try{
        const uid = auth().currentUser?.uid;
        if (!uid) return null;
        return await deleteDartaUserFollowGallery({uid, galleryId});
    } catch (error){
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
        throw new Error(error)
    }
}

export const listArtworksToRateStatelessRandomSamplingAPI = async ({startNumber, endNumber, artworkIds} :{startNumber: number; endNumber: number; artworkIds: string[]}): Promise<{[key: string] : Artwork} | void> => {
    try{
        const uid = auth().currentUser?.uid;
        if (uid) {
        return await listArtworksToRateStatelessRandomSampling({uid, startNumber, endNumber, artworkIds});
        }
    } catch (error){
        // console.log({error})
        throw new Error(error)
    }
}

export const createArtworkListAPI = async ({artworkId, newList} :{artworkId: string; newList: NewList}) => {
    try{
        const uid = auth().currentUser?.uid;
        if (!uid) return null;
        return await createListForUser({newList, artworkId});
    } catch (error){
        throw new Error(error)
    }
}

export const addArtworkToListAPI = async ({artworkId, listId} :{artworkId: string; listId: string}) => {
    try{
        const uid = auth().currentUser?.uid;
        if (!uid) return null;
        return await addArtworkToListAPI({listId, artworkId});
    } catch (error){
        throw new Error(error)
    }
}

export const listUserListsAPI = async () => {
    try{
        const uid = auth().currentUser?.uid;
        if (!uid) return null;
        return await listUserLists();
    } catch (error){
        throw new Error(error)
    }
}



export const editDartaUserAccountAPI = async ({
    data
  }: {
    data : {
    profilePicture?: Images
    userName?: string;
    legalFirstName?: string;
    legalLastName?: string;
    email?: string;
    }
  }): Promise<MobileUser | void> => {
    try{
        const uid = auth().currentUser?.uid;
        if (uid) {
            return await editDartaUserAccount({...data});
        }
    } catch (error){
        throw new Error(error)
    }
}
