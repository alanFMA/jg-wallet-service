import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EntityManager } from '@mikro-orm/postgresql';
import { OutboxEvent } from '../core/domain/OutboxEvent.js';
import type { IMessageBroker } from '../core/ports/IMessageBroker.js';

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);

  constructor(
    private readonly globalEm: EntityManager,
    @Inject('IMessageBroker') private readonly messageBroker: IMessageBroker,
  ) {}

  // O padrão cron abaixo faz o método rodar a cada 5 segundos
  @Cron('*/5 * * * * *')
  async processOutboxEvents() {
    // 1. O MikroORM exige que processos em background tenham seu próprio "fork"
    // (um contexto isolado) para não misturar transações de requisições diferentes
    const em = this.globalEm.fork();

    // 2. Busca todos os eventos que ainda não foram para o SQS
    const unpublishedEvents = await em.find(OutboxEvent, { published: false });

    if (unpublishedEvents.length === 0) {
      return; // Se não tem nada, volta a dormir silenciosamente
    }

    this.logger.log(
      `Found ${unpublishedEvents.length} unpublished event(s). Sending to SQS...`,
    );

    for (const event of unpublishedEvents) {
      try {
        // 3. Tenta enviar para a fila
        await this.messageBroker.publish(event);

        // 4. Se a AWS (LocalStack) aceitou, nós marcamos como publicado na entidade pura
        event.markAsPublished();
      } catch (error) {
        this.logger.error(`Failed to process event ${event.getId()}`, error);
        // Se a AWS cair, o erro para aqui. O evento continua "published: false"
        // e o Worker vai tentar enviá-lo de novo daqui a 5 segundos! (Resiliência na veia)
      }
    }

    // 5. Dá o COMMIT no banco para salvar que os eventos agora estão publicados
    await em.flush();
  }
}
