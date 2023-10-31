import {
  firebaseForgotPassword,
  firebaseSignIn,
  firebaseSignUp,
} from '../ThirdPartyAPIs/firebaseApp';

export const dartaSignUp = async (user: any) => {
  const firebaseCheck = await firebaseSignUp({
    email: user.email,
    password: user.password,
    userName: user.galleryName,
  });
  return firebaseCheck;
};

export const dartaSignIn = async (user: any, signUpType: string) => {
  const firebaseCheck = await firebaseSignIn(
    user.email,
    user.password,
    signUpType,
  );
  await firebaseCheck.user?.getIdToken(/* forceRefresh */ true)
  return firebaseCheck;
};

export const dartaForgotPassword = async (
  user: any,
): Promise<{success: boolean; errorMessage: string} | void> => {
  const firebaseCheck = await firebaseForgotPassword(user.email);
  return firebaseCheck;
};
