// src/modules/wallet/core/use-cases/WithdrawUseCase.ts
import { IWalletRepository } from '../ports/IWalletRepository.js';

export interface WithdrawInput {
  walletId: string;
  amount: number;
}

export class WithdrawUseCase {
  constructor(private readonly walletRepository: IWalletRepository) {}

  public async execute(input: WithdrawInput): Promise<void> {
    // 1. Busca a carteira
    const wallet = await this.walletRepository.findById(input.walletId);

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // 2. Executa a regra de negócio (se não tiver saldo, o domínio vai lançar o throw new Error)
    wallet.withdraw(input.amount);

    // 3. Persiste o novo estado e o evento
    await this.walletRepository.save(wallet);
  }
}
