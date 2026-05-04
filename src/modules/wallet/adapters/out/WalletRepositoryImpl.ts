// src/modules/wallet/adapters/out/WalletRepositoryImpl.ts
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { IWalletRepository } from '../../core/ports/IWalletRepository';
import { Wallet } from '../../core/domain/Wallet';

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

    // 2. Efetiva as mudanças no banco de dados (é o método assíncrono que faz o COMMIT)
    await this.em.flush();
  }
}
