import { Injectable, Logger } from '@nestjs/common';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { IMessageBroker } from '../../core/ports/IMessageBroker.js';
import { OutboxEvent } from '../../core/domain/OutboxEvent.js';

@Injectable()
export class SqsMessageBrokerImpl implements IMessageBroker {
  private readonly sqsClient: SQSClient;
  private readonly logger = new Logger(SqsMessageBrokerImpl.name);

  // Em produção, essa URL viria das variáveis de ambiente (.env)
  private readonly queueUrl =
    'http://localhost:4566/000000000000/wallet-events-queue';

  constructor() {
    // Configuração apontando para o nosso LocalStack do docker-compose
    this.sqsClient = new SQSClient({
      region: 'us-east-1',
      endpoint: 'http://localhost:4566',
      credentials: {
        accessKeyId: 'test', // LocalStack aceita qualquer credencial
        secretAccessKey: 'test',
      },
    });
  }

  public async publish(event: OutboxEvent): Promise<void> {
    try {
      const command = new SendMessageCommand({
        QueueUrl: this.queueUrl,
        // O corpo da mensagem é o payload que estruturamos no domínio
        MessageBody: JSON.stringify(event.getPayload()),

        // Atributos úteis para quem for consumir a fila saber do que se trata
        MessageAttributes: {
          EventType: {
            DataType: 'String',
            StringValue: event.getEventType(),
          },
          AggregateId: {
            DataType: 'String',
            StringValue: event.getAggregateId(),
          },
        },
      });

      await this.sqsClient.send(command);
      this.logger.log(
        `Event ${event.getEventType()} sent to SQS successfully.`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send event ${event.getEventType()} to SQS`,
        error,
      );
      throw error; // Propagamos o erro para o Worker saber que falhou
    }
  }
}
