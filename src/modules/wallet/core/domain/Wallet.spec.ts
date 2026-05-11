import { describe, expect, test, beforeEach } from 'bun:test';
import { Wallet } from './Wallet.js';

describe('Wallet Domain Entity', () => {
  let wallet: Wallet;

  beforeEach(() => {
    // A "carteirada": Forçamos o TypeScript a entender que isso é um Wallet (as Wallet)
    // E pedimos pro ESLint ignorar o alerta de 'any' apenas nesta linha específica.

    wallet = Object.create(Wallet.prototype) as Wallet;

    Reflect.set(wallet, 'id', 'wallet-123');
    Reflect.set(wallet, 'userId', 'user-999');
    Reflect.set(wallet, 'balance', 0);
  });

  test('deve realizar um depósito com sucesso e gerar o evento WalletFunded', () => {
    wallet.deposit(500);

    expect(wallet.getBalance()).toBe(500);

    const events = wallet.getDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0].eventType).toBe('WalletFunded');
    expect(events[0].payload.amount).toBe(500);
  });

  test('não deve permitir depósito de valor zero ou negativo', () => {
    expect(() => wallet.deposit(0)).toThrow(
      'Deposit amount must be greater than zero',
    );
    expect(() => wallet.deposit(-50)).toThrow(
      'Deposit amount must be greater than zero',
    );
  });

  test('deve realizar um saque com sucesso e gerar o evento WalletWithdrawn', () => {
    wallet.deposit(500);
    wallet.clearEvents();

    wallet.withdraw(200);

    expect(wallet.getBalance()).toBe(300);

    const events = wallet.getDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0].eventType).toBe('WalletWithdrawn');
    expect(events[0].payload.amount).toBe(200);
  });

  test('não deve permitir saque se não houver saldo suficiente', () => {
    wallet.deposit(100);

    expect(() => wallet.withdraw(500)).toThrow('Insufficient funds');
    expect(wallet.getBalance()).toBe(100);
  });

  test('não deve permitir saque de valor zero ou negativo', () => {
    expect(() => wallet.withdraw(0)).toThrow(
      'Withdraw amount must be greater than zero',
    );
  });
});
