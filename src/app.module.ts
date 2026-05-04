// src/app.module.ts
import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { WalletModule } from './modules/wallet/WalletModule.js'; // Adicionado .js
import mikroOrmConfig from '../mikro-orm.config.js'; // Ajustado o caminho e adicionado .js

@Module({
  imports: [MikroOrmModule.forRoot(mikroOrmConfig), WalletModule],
  // Removemos as referências ao app.controller e app.service daqui
})
export class AppModule {}
