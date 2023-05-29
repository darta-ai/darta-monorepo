import * as firebaseAuth from '../browserFirebase/firebaseAuth'


export const signUp = async (email: string, password: string) => {
    const firebaseCheck = await firebaseAuth.firebaseSignUp(email, password)
    console.log(firebaseCheck)
}