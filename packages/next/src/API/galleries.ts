import axios from 'axios';

const API_URL = 'http://localhost:1160';

export const getGallery = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
