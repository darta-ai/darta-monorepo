import axios from "axios";

const URL = "http://localhost:1160"

export async function getGallery(): Promise<void> {
    try {
        const response = await axios.get(`${URL}/ping`);
        console.log(response)
    } catch (error) {
        console.error(error);
    }
}