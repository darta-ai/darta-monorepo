import auth from '@react-native-firebase/auth';

export const firebaseSignUp = async ({email, password}: {email: string, password: string}) => {

    try {
        const res = await auth().createUserWithEmailAndPassword(email, password);
        console.log(res)
        return res;
    } catch(e){
        if (e.code === 'auth/email-already-in-use') {
            throw new Error('That email address is already in use!');
          }
      
          if (e.code === 'auth/invalid-email') {
            throw new Error('That email address is invalid!');
          }
    }
}

export const firebaseSignIn = async ({email, password}: {email: string, password: string}) => {

  try {
      const res = await auth().signInWithEmailAndPassword(email, password);
      return res;
  } catch(e){
    console.log({e})
      if (e.code === 'auth/email-already-in-use') {
          throw new Error('That email address is already in use!');
        }
    
        if (e.code === 'auth/invalid-email') {
          throw new Error('That email address is invalid!');
        }
      throw new Error('Something went wrong, please try again')
  }
}

export enum FirebaseSetUserEnum {
    displayName = 'displayName',
    email = 'email',
    userName = 'userName',
}

export const firebaseSetUser = async ({type, data}: {type: FirebaseSetUserEnum, data: any}) => {

  try {
      const res = await auth().currentUser?.updateProfile({
        [type]: data,
      })
      console.log(res)
      return res;
  } catch(e){
      
  }
}

export const firebaseDeleteUser = async ({password} : {password: string}) => {
  try {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('No user found');
    }

    await auth().signInWithEmailAndPassword(user.email!, password);
    const results = await user?.delete()
    return results;
  } catch(e){
    throw new Error ('Unable to delete user')
  }
}
