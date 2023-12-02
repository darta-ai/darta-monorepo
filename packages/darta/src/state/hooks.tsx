import { NewList } from "@darta-types/dist";
import analytics from '@react-native-firebase/analytics';
import { createArtworkListAPI } from "../utils/apiCalls";

export const saveArtworkToList = async ({artworkId, newList}: {artworkId: string, newList: NewList}) => {
    const isDev = process.env.EXPO_PUBLIC_ENVIRONMENT === "development";
    try{
        await createArtworkListAPI({newList, artworkId})
        if (!isDev){
            analytics().logEvent('save_artwork_to_list', {
                artworkId: artworkId,
                list: newList,
            })
        }
    } catch (error) {
        console.log("error saving list", error)
        if (!isDev){
            analytics().logEvent('save_artwork_to_list_error', {
                artworkId: artworkId,
                list: newList,
                error: error,
            })
        }
    }
}