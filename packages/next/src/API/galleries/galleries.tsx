import axios from "axios";
import { auth } from "../../ThirdPartyAPIs/firebaseApp";
import {GalleryBase} from '@darta/types'

const URL = "http://localhost:1160"

export async function getGalleryProfile(): Promise<any> {
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    try {
        const response = await axios.get(`${URL}/gallery/galleryProfile`, {headers: {'authorization': `Bearer ${idToken}`}});
        return response;
    } catch (error) {
        throw new Error('Unable to retrieve profile')
    }
}

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
        throw new Error('Unable to create profile')
    }
}