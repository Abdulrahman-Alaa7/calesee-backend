import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

type mailOptions = {
  subject: string;
  email: string;
  name: string;
  activationCode: string;
  template: string;
  order?: {
    id: string;
    date: string;
    theShippingPrice: number;
    products: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    totalPrice: number;
  };
};
@Injectable()
export class EmailService {
  constructor(private mailService: MailerService) {}

  async sendMail({
    subject,
    email,
    name,
    activationCode,
    template,
    order,
  }: mailOptions) {
    await this.mailService.sendMail({
      to: email,
      subject,
      template,
      context: {
        name,
        activationCode,
        order,
      },
    });
  }
}
