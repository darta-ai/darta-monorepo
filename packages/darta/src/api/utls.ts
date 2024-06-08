import auth from '@react-native-firebase/auth';

export const generateHeaders = async () => {
  try {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('No user found');
    }
    const token = await user.getIdToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  } catch(e){
    throw new Error ('Unable to generate headers')
  }
}


export const generateUid = async () => {
  try {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('No user found');
    }
    return user.uid;
  } catch(e){
    throw new Error ('Unable to generate headers')
  }
}