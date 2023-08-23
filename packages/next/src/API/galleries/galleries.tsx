import axios from "axios";
import { auth } from "../../ThirdPartyAPIs/firebaseApp";

const URL = "http://localhost:1160"

export async function galleryPostUUID(): Promise<any> {
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    console.log({idToken})
    try {
        const response = await axios.get(`${URL}/gallery/galleryProfile`, {headers: {'authorization': `Bearer ${idToken}`}});
        return response;
    } catch (error) {
        throw new Error('Unable to retrieve profile')
    }
}