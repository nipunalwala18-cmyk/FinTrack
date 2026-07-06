import { EventEmitter } from 'events';

class AIEventBus extends EventEmitter {}

export const aiEventBus = new AIEventBus();

export const AI_EVENTS = {
  TRANSACTION_CREATED: 'transaction:created',
  TRANSACTION_UPDATED: 'transaction:updated',
  TRANSACTION_DELETED: 'transaction:deleted',
  GOAL_UPDATED: 'goal:updated',
  BUDGET_UPDATED: 'budget:updated',
};
