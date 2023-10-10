import auth from '@react-native-firebase/auth';

export const firebaseSignUp = async ({email, password}: {email: string, password: string}) => {
    auth()
    .createUserWithEmailAndPassword(email, password)
    .then((res) => {
        console.log('User account created & signed in!');
        return res;
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('That email address is already in use!');
      }
  
      if (error.code === 'auth/invalid-email') {
        throw new Error('That email address is invalid!');
      }
  
      console.error(error);
    });
}