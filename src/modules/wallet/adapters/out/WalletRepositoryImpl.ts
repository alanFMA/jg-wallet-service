// src/modules/wallet/adapters/out/WalletRepositoryImpl.ts
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { IWalletRepository } from '../../core/ports/IWalletRepository.js';
import { Wallet } from '../../core/domain/Wallet.js';
import { OutboxEvent } from '../../core/domain/OutboxEvent.js';

@Injectable()
export class WalletRepositoryImpl implements IWalletRepository {
  constructor(private readonly em: EntityManager) {}

  public async findById(id: string): Promise<Wallet | null> {
    // O MikroORM usa a referência da classe no Schema para fazer a busca
    return this.em.findOne(Wallet, { id });
  }

  public async save(wallet: Wallet): Promise<void> {
    // 1. Adiciona a entidade ao contexto do Unit of Work (é um método síncrono)
    this.em.persist(wallet);

    const events = wallet.getDomainEvents();

    for (const event of events) {
      const outboxEvent = OutboxEvent.create(
        'Wallet',
        wallet.getId(),
        event.eventType,
        event.payload,
      );

      this.em.persist(outboxEvent);
    }
    // 2. Efetiva as mudanças no banco de dados (é o método assíncrono que faz o COMMIT)
    await this.em.flush();

    wallet.clearEvents();
  }
}
