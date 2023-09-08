import axios from "axios";
import { auth } from "../../ThirdPartyAPIs/firebaseApp";
import { Exhibition, Artwork} from "@darta/types";

const URL = "http://localhost:1160/exhibition"

export async function createExhibition({exhibition} : any): Promise<any> {
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    try {
        const response = await axios.post(`${URL}/create`, {exhibition} , {headers: {'authorization': `Bearer ${idToken}`}});
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error('Unable to create exhibition')
    }
}

export async function editExhibition({exhibition} : any): Promise<any> {
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    try {
        const response = await axios.post(`${URL}/edit`, {exhibition} , {headers: {'authorization': `Bearer ${idToken}`}});
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error('Unable to edit exhibition')
    }
}


export async function listExhibitionsByGallery(): Promise<any> {
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    try {
        const response = await axios.get(`${URL}/listForGallery`, {headers: {'authorization': `Bearer ${idToken}`}});
        const mappedGalleryExhibitions = response.data.reduce((accumulator : any, exhibition: Exhibition) => {
            if (exhibition?.exhibitionId) {
              accumulator[exhibition.exhibitionId] = exhibition;
            }
            return accumulator;
          }, {});
        return mappedGalleryExhibitions
    } catch (error) {
        console.log(error)
        throw new Error('Unable list exhibitions')
    }
}