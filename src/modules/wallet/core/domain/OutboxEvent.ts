export class OutboxEvent {
  private id: string;
  private aggregateType: string; // Ex: 'Wallet'
  private aggregateId: string; // Ex: ID da carteira
  private eventType: string; // Ex: 'WalletFunded'
  private payload: Record<string, unknown>; // Os dados do evento em JSON
  private published: boolean; // Flag para sabermos se já foi pro SQS
  private createdAt: Date;

  private constructor(
    id: string,
    aggregateType: string,
    aggregateId: string,
    eventType: string,
    payload: Record<string, unknown>,
  ) {
    this.id = id;
    this.aggregateType = aggregateType;
    this.aggregateId = aggregateId;
    this.eventType = eventType;
    this.payload = payload;
    this.published = false; // Começa sempre como não publicado
    this.createdAt = new Date();
  }

  // Factory Method
  public static create(
    aggregateType: string,
    aggregateId: string,
    eventType: string,
    payload: Record<string, unknown>,
  ): OutboxEvent {
    const id = crypto.randomUUID();
    return new OutboxEvent(id, aggregateType, aggregateId, eventType, payload);
  }

  // Método para o nosso Worker marcar como enviado depois
  public markAsPublished(): void {
    this.published = true;
  }

  // Getters para o MikroORM ler os dados
  public getId(): string {
    return this.id;
  }
  public getAggregateType(): string {
    return this.aggregateType;
  }
  public getAggregateId(): string {
    return this.aggregateId;
  }
  public getEventType(): string {
    return this.eventType;
  }
  public getPayload(): Record<string, unknown> {
    return this.payload;
  }
  public isPublished(): boolean {
    return this.published;
  }
  public getCreatedAt(): Date {
    return this.createdAt;
  }
}
