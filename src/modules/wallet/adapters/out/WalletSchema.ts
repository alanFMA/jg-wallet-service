// src/modules/wallet/adapters/out/WalletSchema.ts
import { EntitySchema, EntityCtor } from '@mikro-orm/core'; // Adicione o EntityCtor aqui
import { Wallet } from '../../core/domain/Wallet';

export const WalletSchema = new EntitySchema<Wallet>({
  // Transformamos a classe primeiro em unknown (seguro) e depois no tipo exato que o MikroORM exige
  class: Wallet as unknown as EntityCtor<Wallet>,
  tableName: 'wallets',
  properties: {
    id: { type: 'uuid', primary: true },
    userId: { type: 'uuid' },
    balance: { type: 'integer' },
    createdAt: { type: 'datetime' },
  },
});
