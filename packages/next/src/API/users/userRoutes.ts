import axios from "axios";
import { auth } from "../../ThirdPartyAPIs/firebaseApp";
import {GalleryBase, IGalleryProfileData} from '@darta/types'

const URL = "http://localhost:1160/users"

export async function createGalleryUser({galleryName, 
    signUpWebsite, 
    primaryOwnerPhone, 
    primaryOwnerEmail} : any): Promise<any> {
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    try {
        const response = await axios.post(`${URL}/newGallery`, {
            galleryName,
            signUpWebsite, 
            primaryOwnerPhone, primaryOwnerEmail} as GalleryBase, {headers: {'authorization': `Bearer ${idToken}`}});
        return response;
    } catch (error) {
        console.log(error)
        throw new Error('Unable to create profile')
    }
}
