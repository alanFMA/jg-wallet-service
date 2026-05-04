// src/modules/wallet/adapters/in/WalletController.ts
import {
  Controller,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { DepositUseCase } from '../../core/use-cases/DepositUseCase.js';

// DTO para validar a entrada
export class DepositDto {
  // O "!" é o Definite Assignment Assertion. Ele avisa ao compilador:
  // "Confie em mim, o framework (NestJS) vai injetar esse valor em tempo de execução."
  amount!: number;
}

@Controller('wallets')
export class WalletController {
  constructor(private readonly depositUseCase: DepositUseCase) {}

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
}
