import axios from "axios";
import { auth } from "../../ThirdPartyAPIs/firebaseApp";
import {GalleryBase, IGalleryProfileData} from '@darta/types'

const URL = "http://localhost:1160/exhibition"

export async function createExhibition({exhibition} : any): Promise<any> {
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    try {
        const response = await axios.post(`${URL}/create`, {exhibition} , {headers: {'authorization': `Bearer ${idToken}`}});
        return response;
    } catch (error) {
        console.log(error)
        throw new Error('Unable to create profile')
    }
}
