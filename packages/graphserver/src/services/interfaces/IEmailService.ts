import { DynamicTemplateData } from './IAdminService';

export interface IEmailService {
    sgSendEmail({to, from, subject, text, html} : {to: string, from: string, subject: string, text: string, html?: string}): Promise<string>;
  sgSendEmailInquireTemplate(
    {to, from, dynamicTemplateData}  : 
    {to: string, from: string, dynamicTemplateData: DynamicTemplateData})
    : Promise<string>;
}
