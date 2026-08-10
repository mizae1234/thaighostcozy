import type { GameEvents } from './types';

type Listener<T> = (payload: T) => void;

class TypedEventBus<TEvents extends Record<string, unknown>> {
  private listeners = new Map<keyof TEvents, Set<Listener<unknown>>>();

  on<K extends keyof TEvents>(event: K, listener: Listener<TEvents[K]>) {
    const set = this.listeners.get(event) ?? new Set();
    set.add(listener as Listener<unknown>);
    this.listeners.set(event, set);
  }

  off<K extends keyof TEvents>(event: K, listener: Listener<TEvents[K]>) {
    this.listeners.get(event)?.delete(listener as Listener<unknown>);
  }

  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]) {
    this.listeners.get(event)?.forEach((listener) => listener(payload));
  }
}

export const EventBus = new TypedEventBus<GameEvents>();
