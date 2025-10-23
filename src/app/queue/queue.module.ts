import { Module } from '@nestjs/common';
import { MailQueueProducer, MailQueueConsumer } from './queue.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'mailQueue',
    }),
  ],
  providers: [MailQueueProducer, MailQueueConsumer],
  exports: [MailQueueProducer],
})
export class QueueModule {}
