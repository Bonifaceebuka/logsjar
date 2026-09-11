import {
  IncomingLogEvent,
  LOG_LEVELS,
} from '../types/logs.type';

export function validateLogEvent(
  value: unknown,
): value is IncomingLogEvent {
  try{
    if (
    typeof value !== 'object' ||
    value === null ||
    Array.isArray(value)
  ) {
    return false;
  }

  const event = value as Record<string, unknown>;

  if (typeof event.type !== 'string') {
    return false;
  }

  if (
    event.level && typeof event.level !== 'string' ||
    !LOG_LEVELS.includes(event.level as Exclude<IncomingLogEvent['level'], undefined>,
    )
  ) {
    return false;
  }

  if (
    typeof event.timestamp !== 'number' ||
    !Number.isFinite(event.timestamp)
  ) {
    return false;
  }

  if (typeof event.message !== 'string') {
    return false;
  }

  if (typeof event.environment !== 'string') {
    return false;
  }

  if (
    event.context !== undefined &&
    (
      typeof event.context !== 'object' ||
      event.context === null ||
      Array.isArray(event.context)
    )
  ) {
    return false;
  }

  return true;
  }
  catch(err){
    console.log({err})
    return false
  }
}