// src/modules/wallet/core/domain/Wallet.ts

export type DomainEvent = {
  eventType: string;
  payload: Record<string, unknown>;
};

export class Wallet {
  private id: string;
  private userId: string;
  private balance: number; // Trabalhar com centavos é boa prática financeira
  private createdAt: Date;

  private events: DomainEvent[] = [];

  private constructor(
    id: string,
    userId: string,
    balance: number,
    createdAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.balance = balance;
    this.createdAt = createdAt;
  }

  // Factory method para criar uma carteira nova
  public static create(userId: string): Wallet {
    const id = crypto.randomUUID(); // Usando a API nativa do Node/Bun
    return new Wallet(id, userId, 0, new Date());
  }

  // Método para reconstituir a entidade a partir do banco de dados (o ORM usará isso indiretamente)
  public static restore(
    id: string,
    userId: string,
    balance: number,
    createdAt: Date,
  ): Wallet {
    return new Wallet(id, userId, balance, createdAt);
  }

  // Regra de negócio: Depósito
  public deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error('Deposit amount must be greater than zero');
    }
    this.balance += amount;

    if (!this.events) {
      this.events = [];
    }

    this.events.push({
      eventType: 'WalletFunded',
      payload: {
        walletId: this.id,
        userId: this.userId,
        amount: amount,
        newBalance: this.balance,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Regra de negócio: Saque
  public withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error('Withdraw amount must be greater than zero');
    }
    if (this.balance < amount) {
      throw new Error('Insufficient funds');
    }
    this.balance -= amount;

    if (!this.events) {
      this.events = [];
    }

    this.events.push({
      eventType: 'WalletWithdrawn',
      payload: {
        walletId: this.id,
        userId: this.userId,
        amount: amount,
        newBalance: this.balance,
        timestamp: new Date().toISOString(),
      },
    });
  }

  public getDomainEvents(): DomainEvent[] {
    return [...(this.events || [])];
  }

  public clearEvents(): void {
    if (this.events) {
      this.events.length = 0;
    }
  }
  // Getters para expor os dados (sem setters, para proteger o estado)
  public getId(): string {
    return this.id;
  }
  public getUserId(): string {
    return this.userId;
  }
  public getBalance(): number {
    return this.balance;
  } // Exemplo simples
  public getBalanceAmount(): number {
    return this.balance;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }
}
