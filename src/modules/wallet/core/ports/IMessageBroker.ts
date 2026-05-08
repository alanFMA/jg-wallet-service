import { OutboxEvent } from '../domain/OutboxEvent.js';

export interface IMessageBroker {
  publish(event: OutboxEvent): Promise<void>;
}
