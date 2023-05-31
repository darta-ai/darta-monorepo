import {firebaseSignUp, firebaseSignIn} from '../browserFirebase/firebaseApp';

export const dartaSignUp = async (user: any, signUpType: string) => {
  const firebaseCheck = await firebaseSignUp(
    user.email,
    user.password,
    signUpType,
  );
  return firebaseCheck;
};

export const dartaSignIn = async (user: any, signUpType: string) => {
  const firebaseCheck = await firebaseSignIn(
    user.email,
    user.password,
    signUpType,
  );
  return firebaseCheck;
};
