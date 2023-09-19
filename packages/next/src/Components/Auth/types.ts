export enum AuthEnum {
  galleries = 'Galleries',
  artists = 'Artists',
  curators = 'Curators',
  home = 'Home',
}

export type DartaBenefits = {
  Headline?: string;
  Field1?: string;
  Field2?: string;
  Field3?: string;
  Field4?: string;
  Field1Subset?: string;
  Field2Subset?: string;
  Field3Subset?: string;
  Field4Subset?: string;
};

export type WelcomeBack = {
  Headline?: string;
  Footer?: string;
  HelpEmail?: string;
  Field1?: string;
  Field2?: string;
  Field3?: string;
  Field4?: string;
  Field1Subset?: string;
  Field2Subset?: string;
  Field3Subset?: string;
  Field4Subset?: string;
};

export const forgotPasswordText: WelcomeBack = {
  Headline: 'Forgot your password? It happens.',
  Field1: "You'll receive an email with a link to reset your password",
  Footer: 'If you have any concerns about your account, please contact us',
  HelpEmail: 'support@darta.art',
};
