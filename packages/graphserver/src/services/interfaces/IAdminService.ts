export type DynamicTemplateData = {
  artworkTitle: string
  artistName: string
  galleryName: string 
  userFirstName: string
  userLastName: string
  userEmail: string
}

export interface IAdminService {
  validateAndCreateCollectionsAndEdges(): Promise<void>;
  addApprovedGallerySDL(sdl: string): Promise<string>;
  addMinioBucker(bucketName: string): Promise<string>;
  sgSendEmail({to, from, subject, text, html} : {to: string, from: string, subject: string, text: string, html?: string}): Promise<string>;
  sgSendEmailInquireTemplate(
    {to, from, dynamicTemplateData}  : 
    {to: string, from: string, dynamicTemplateData: DynamicTemplateData})
    : Promise<string>;
}
