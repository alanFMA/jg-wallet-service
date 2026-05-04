// src/modules/wallet/core/ports/IWalletRepository.ts
import { Wallet } from '../domain/Wallet.js';

export interface IWalletRepository {
  findById(id: string): Promise<Wallet | null>;
  save(wallet: Wallet): Promise<void>;
}
