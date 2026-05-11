// src/modules/wallet/core/use-cases/GetBalanceUseCase.ts
import { IWalletRepository } from '../ports/IWalletRepository.js';

export class GetBalanceUseCase {
  constructor(private readonly walletRepository: IWalletRepository) {}

  public async execute(walletId: string): Promise<number> {
    const wallet = await this.walletRepository.findById(walletId);

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Usamos o nosso Getter que criamos durante os testes!
    return wallet.getBalance();
  }
}
