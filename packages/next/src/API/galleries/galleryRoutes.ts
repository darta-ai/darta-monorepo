import axios from "axios";
import { auth } from "../../ThirdPartyAPIs/firebaseApp";
import {GalleryBase, IGalleryProfileData} from '@darta/types'

const URL = "http://localhost:1160/gallery"

export async function createGalleryProfileAPI({galleryName, 
    signUpWebsite, 
    primaryOwnerPhone, 
    primaryOwnerEmail} : any): Promise<any> {
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    try {
        const response = await axios.post(`${URL}/createProfile`, {
            galleryName,
            signUpWebsite, 
            primaryOwnerPhone, primaryOwnerEmail} as GalleryBase, {headers: {'authorization': `Bearer ${idToken}`}});
        return response;
    } catch (error) {
        console.log(error)
        throw new Error('Unable to create profile')
    }
}

export async function readGalleryProfileAPI(): Promise<any> {
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    try {
        const response = await axios.get(`${URL}/galleryProfile`, {headers: {'authorization': `Bearer ${idToken}`}});
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error('Unable to retrieve profile')
    }
}



export async function updateGalleryProfileAPI(data : IGalleryProfileData): Promise<any> {
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    try {
        const response = await axios.post(`${URL}/editProfile`, {data}, {headers: {'authorization': `Bearer ${idToken}`}});
        return response;
    } catch (error) {
        console.log(error)
        throw new Error('Unable to update profile')
    }
}