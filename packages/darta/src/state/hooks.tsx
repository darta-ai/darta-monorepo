import analytics from '@react-native-firebase/analytics';
import { addArtworkToListAPI } from "../utils/apiCalls";

export const saveArtworkToList = async ({artworkId, listId}: {artworkId: string, listId: string}) => {
    try{
        await addArtworkToListAPI({listId, artworkId})
    } catch (error) {
        console.log("error saving list", error)
    }
}