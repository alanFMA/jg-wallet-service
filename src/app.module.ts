// src/app.module.ts
import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { WalletModule } from './modules/wallet/WalletModule.js'; // Adicionado .js
import mikroOrmConfig from '../mikro-orm.config.js'; // Ajustado o caminho e adicionado .js
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MikroOrmModule.forRoot(mikroOrmConfig),
    WalletModule,
  ],
})
export class AppModule {}
