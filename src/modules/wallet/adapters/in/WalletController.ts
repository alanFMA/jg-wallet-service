// src/modules/wallet/adapters/in/WalletController.ts
import {
  Controller,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  HttpException,
  Get,
} from '@nestjs/common';
import { DepositUseCase } from '../../core/use-cases/DepositUseCase.js';
import { WithdrawUseCase } from '../../core/use-cases/WithdrawUseCase.js';
import { GetBalanceUseCase } from '../../core/use-cases/GetBalanceUseCase.js';

// DTO para validar a entrada
export class DepositDto {
  // O "!" é o Definite Assignment Assertion. Ele avisa ao compilador:
  // "Confie em mim, o framework (NestJS) vai injetar esse valor em tempo de execução."
  amount!: number;
}

export class WithdrawDto {
  amount!: number;
}

@Controller('wallets')
export class WalletController {
  constructor(
    private readonly depositUseCase: DepositUseCase,
    private readonly withdrawUseCase: WithdrawUseCase,
    private readonly getBalanceUseCase: GetBalanceUseCase,
  ) {}

  @Post(':id/deposit')
  @HttpCode(HttpStatus.OK)
  async deposit(@Param('id') walletId: string, @Body() body: DepositDto) {
    try {
      await this.depositUseCase.execute({
        walletId,
        amount: body.amount,
      });
      return { message: 'Deposit successful' };
    } catch (error: unknown) {
      // Mudamos de "any" para "unknown" (mais seguro)

      // Checagem de tipo (Type Guard) para garantir ao ESLint que "error" é um objeto de Erro
      if (error instanceof Error) {
        if (error.message === 'Wallet not found') {
          throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      // Fallback genérico caso o que tenha sido lançado não seja um erro mapeado
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/withdraw')
  @HttpCode(HttpStatus.OK) // Padroniza o retorno de sucesso para 200 OK
  async withdraw(@Param('id') walletId: string, @Body() body: WithdrawDto) {
    try {
      await this.withdrawUseCase.execute({
        walletId,
        amount: body.amount,
      });
      return { message: 'Withdrawal successful' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Wallet not found') {
          throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/balance')
  async getBalance(@Param('id') walletId: string) {
    try {
      const balance = await this.getBalanceUseCase.execute(walletId);

      return {
        walletId,
        balance,
      };
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Wallet not found') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
