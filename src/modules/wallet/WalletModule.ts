// src/modules/wallet/WalletModule.ts
import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { WalletSchema } from './adapters/out/WalletSchema.js';
import { WalletRepositoryImpl } from './adapters/out/WalletRepositoryImpl.js';
import { DepositUseCase } from './core/use-cases/DepositUseCase.js';
import { WalletController } from './adapters/in/WalletController.js';
import { IWalletRepository } from './core/ports/IWalletRepository.js';

@Module({
  // Importamos o Schema para o MikroORM saber lidar com ele neste módulo
  imports: [MikroOrmModule.forFeature([WalletSchema])],
  controllers: [WalletController],
  providers: [
    // 1. Ensinamos o Nest: "Quando alguém pedir IWalletRepository, entregue o WalletRepositoryImpl"
    {
      provide: 'IWalletRepository',
      useClass: WalletRepositoryImpl,
    },
    // 2. Ensinamos o Nest: "Como o DepositUseCase é puro, eu te mostro como construí-lo"
    {
      provide: DepositUseCase,
      useFactory: (repository: IWalletRepository) =>
        new DepositUseCase(repository),
      inject: ['IWalletRepository'], // Injeta o token que definimos logo acima
    },
  ],
})
export class WalletModule {}
