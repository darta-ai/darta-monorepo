import axios from "axios";
import { auth } from "../../ThirdPartyAPIs/firebaseApp";
import { Artwork } from '@darta/types'

const URL = "http://localhost:1160/artwork"

export async function createArtworkAPI(): Promise<Artwork> {
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    console.log('triggered')
    try {
        const response = await axios.get(`${URL}/create`, {headers: {'authorization': `Bearer ${idToken}`}});
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error('Unable to create artwork')
    }
}


export async function editArtworkAPI({artwork} : {artwork : Artwork}): Promise<Artwork> {
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    try {
        const response = await axios.post(`${URL}/edit`, {artwork} , {headers: {'authorization': `Bearer ${idToken}`}});
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error('Unable edit artwork')
    }
}

export async function deleteArtworkAPI(artworkId: string): Promise<any>{
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    try {
        const response = await axios.post(`${URL}/delete`, {artworkId} , {headers: {'authorization': `Bearer ${idToken}`}});
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error('Unable edit artwork')
    }
}


export async function createArtworkForExhibitionAPI({exhibitionId, exhibitionOrder} :{exhibitionId: string, exhibitionOrder: number}): Promise<any> {
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    try {
        const response = await axios.post(`${URL}/createArtworkForExhibition`, {exhibitionId, exhibitionOrder} , {headers: {'authorization': `Bearer ${idToken}`}});
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error('Unable to edit exhibition')
    }
}

export async function editArtworkForExhibitionAPI({artwork} :{exhibitionId: string, artwork: Artwork}): Promise<any> {
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    try {
        const response = await axios.post(`${URL}/editArtworkForExhibition`, {artwork} , {headers: {'authorization': `Bearer ${idToken}`}});
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error('Unable to edit exhibition')
    }
}

export async function deleteArtworkOnExhibitionAPI({artworkId} :{artworkId: string}): Promise<any> {
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    try {
        const response = await axios.post(`${URL}/deleteArtwork`, {artworkId} , {headers: {'authorization': `Bearer ${idToken}`}});
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error('Unable to edit exhibition')
    }
}


export async function listArtworksByGallery(): Promise<any> {
    const idToken = await auth.currentUser?.getIdToken(/* forceRefresh */ true)
    try {
        const response = await axios.get(`${URL}/listGalleryArtworks`, {headers: {'authorization': `Bearer ${idToken}`}});
        const mappedGalleryArtworks = response.data.reduce((accumulator : any, artwork: Artwork) => {
            if (artwork?.artworkId) {
              accumulator[artwork.artworkId] = artwork;
            }
            return accumulator;
          }, {});
        return mappedGalleryArtworks
    } catch (error) {
        console.log(error)
        // throw new Error('Unable edit artwork')
    }
}