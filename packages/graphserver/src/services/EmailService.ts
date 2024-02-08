import {injectable} from 'inversify';

import { SENDGRID_INQUIRE_TEMPLATE_ID, sgMail } from '../config/config';
import { DynamicTemplateData } from './interfaces/IAdminService';
import { IEmailService } from './interfaces/IEmailService';


@injectable()
export class EmailService implements IEmailService {
  constructor() {}

  // eslint-disable-next-line class-methods-use-this
  public async sgSendEmailInquireTemplate({to, from, dynamicTemplateData} 
    : 
    {to: string, from: string, dynamicTemplateData: DynamicTemplateData}
    ): Promise<string>{
    try {
      const msg = {
          to,
          from: from || 'tj@darta.art',
          templateId: SENDGRID_INQUIRE_TEMPLATE_ID,
          content: [
            {
              type: 'text/html',
              value: 'text',
            },
          ] as any,
          dynamicTemplateData,
      }

      await sgMail.send(msg);
      return 'sent'
  } catch (error: any) {
      throw new Error(`failed to send email: ${error?.message}`)
  }
  }

  // eslint-disable-next-line class-methods-use-this
  public async sgSendEmail({to, from, subject, text, html} 
    : 
    {to: string, from: string, subject: string, text: string, html?: string}
    ): Promise<string>{
    try {
      const msg = {
          to,
          from: from || 'tj@darta.art',
          subject,
          text,
          html,
      };

      await sgMail.send(msg);
      return 'sent'
    } catch (error: any) {
        throw new Error(`failed to send email: ${error?.message}`)
    }
  }

}