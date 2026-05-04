// src/modules/wallet/core/use-cases/DepositUseCase.ts
import { IWalletRepository } from '../ports/IWalletRepository.js';

// DTO (Data Transfer Object) simples para a entrada do caso de uso
export interface DepositInput {
  walletId: string;
  amount: number;
}

export class DepositUseCase {
  // A injeção de dependência acontece aqui. O NestJS vai se encarregar
  // de entregar a implementação real do repositório em tempo de execução.
  constructor(private readonly walletRepository: IWalletRepository) {}

  public async execute(input: DepositInput): Promise<void> {
    // 1. Busca a carteira
    const wallet = await this.walletRepository.findById(input.walletId);

    if (!wallet) {
      throw new Error('Wallet not found'); // Em produção, usaríamos exceções customizadas do domínio
    }

    // 2. Executa a regra de negócio (o domínio se protege)
    wallet.deposit(input.amount);

    // 3. Persiste o novo estado
    await this.walletRepository.save(wallet);
  }
}
