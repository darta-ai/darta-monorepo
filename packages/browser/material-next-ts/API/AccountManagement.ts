import * as firebaseAuth from '../browserFirebase/firebaseAuth'
import { writeWaitList } from '../browserFirebase/firebaseDB'


export const signUp = async (user: any, signUpType: string) => {
    const firebaseCheck = await firebaseAuth.firebaseSignUp(user.email, user.password)
    const waitListResults = await writeWaitList(user, signUpType)
    return firebaseCheck
}