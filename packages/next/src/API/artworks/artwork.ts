import axios from "axios";
import { auth } from "../../ThirdPartyAPIs/firebaseApp";
import { Artwork } from '@darta/types'

const URL = "http://localhost:1160"

export async function createArtwork(newArtwork: Artwork): Promise<any> {
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    try {
        const response = await axios.post(`${URL}/artwork/create`, {artwork: newArtwork}, {headers: {'authorization': `Bearer ${idToken}`}});
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error('Unable to create artwork')
    }
}


export async function editArtwork(artwork : Artwork): Promise<any> {
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    try {
        const response = await axios.post(`${URL}/artwork/edit`, {artwork} , {headers: {'authorization': `Bearer ${idToken}`}});
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error('Unable edit artwork')
    }
}
