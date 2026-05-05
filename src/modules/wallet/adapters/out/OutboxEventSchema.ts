import { EntitySchema, EntityCtor } from '@mikro-orm/core';
import { OutboxEvent } from '../../core/domain/OutboxEvent.js'; // Lembre-se do .js!

export const OutboxEventSchema = new EntitySchema<OutboxEvent>({
  class: OutboxEvent as unknown as EntityCtor<OutboxEvent>,
  tableName: 'outbox_events',
  properties: {
    id: { type: 'uuid', primary: true },
    aggregateType: { type: 'string' },
    aggregateId: { type: 'string' },
    eventType: { type: 'string' },
    payload: { type: 'json' }, // O PostgreSQL tem suporte nativo maravilhoso a JSON
    published: { type: 'boolean', default: false },
    createdAt: { type: 'datetime' },
  },
});
