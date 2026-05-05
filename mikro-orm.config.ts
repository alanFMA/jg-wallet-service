// apps/jg-wallet-service/mikro-orm.config.ts
import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { WalletSchema } from './src/modules/wallet/adapters/out/WalletSchema.js';
import { OutboxEventSchema } from 'src/modules/wallet/adapters/out/OutboxEventSchema.js';

const config: Options = {
  driver: PostgreSqlDriver,
  dbName: 'igaming_wallet',
  user: 'jungle_user',
  password: 'jungle_password',
  host: '127.0.0.1',
  port: 5432,
  entities: [WalletSchema, OutboxEventSchema],
  debug: true, // Excelente para ver as queries geradas no terminal durante o desenvolvimento
  migrations: {
    path: './src/migrations',
    emit: 'ts',
  },
};

export default config;
