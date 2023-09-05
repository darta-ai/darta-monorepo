import axios from "axios";
import { auth } from "../../ThirdPartyAPIs/firebaseApp";
import {GalleryBase, IGalleryProfileData} from '@darta/types'

const URL = "http://localhost:1160"

export async function createGalleryProfile({galleryName, 
    signUpWebsite, 
    primaryOwnerPhone, 
    primaryOwnerEmail} : GalleryBase): Promise<any> {
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    try {
        const response = await axios.post(`${URL}/gallery/createProfile`, {
            galleryName,
            signUpWebsite, 
            primaryOwnerPhone, primaryOwnerEmail} as GalleryBase, {headers: {'authorization': `Bearer ${idToken}`}});
        return response;
    } catch (error) {
        console.log(error)
        throw new Error('Unable to create profile')
    }
}

export async function readGalleryProfile(): Promise<any> {
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    try {
        const response = await axios.get(`${URL}/gallery/galleryProfile`, {headers: {'authorization': `Bearer ${idToken}`}});
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error('Unable to retrieve profile')
    }
}



export async function updateGalleryProfile(data : IGalleryProfileData): Promise<any> {
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    try {
        const response = await axios.post(`${URL}/gallery/editProfile`, {data} as IGalleryProfileData, {headers: {'authorization': `Bearer ${idToken}`}});
        return response;
    } catch (error) {
        console.log(error)
        throw new Error('Unable to update profile')
    }
}