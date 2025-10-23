import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bullmq';

@Injectable()
export class MailQueueProducer {
  constructor(@InjectQueue('mailQueue') private mailQueue: Queue) {}

  async sendMail(mailOptions: ISendMailOptions) {
    this.mailQueue.add('sendEmail', mailOptions, {
      attempts: 3,
      removeOnComplete: true,
    });
    Logger.log(
      `Mail job added for email to: ${mailOptions.to}`,
      'MailQueueProducer',
    );
  }
}

@Processor('mailQueue')
export class MailQueueConsumer extends WorkerHost {
  constructor(private mailer: MailerService) {
    super();
  }

  async process(job: Job<any, ISendMailOptions, string>): Promise<any> {
    const response = await this.mailer.sendMail(job.data);
    Logger.log(`Email sent: ${JSON.stringify(response)}`, 'MailQueueConsumer');
    return {};
  }
}
