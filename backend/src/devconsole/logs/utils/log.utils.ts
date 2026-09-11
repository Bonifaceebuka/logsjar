import {
  IncomingLogEvent,
  LOG_LEVELS,
} from '../types/logs.type';

const MAX_MESSAGE_LENGTH = 100_000;
const MAX_ENVIRONMENT_LENGTH = 50;
const MAX_TYPE_LENGTH = 50;

export function validateLogEvent(
  value: unknown,
): value is IncomingLogEvent {
    // console.log({value})
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

  if (event.type.length > MAX_TYPE_LENGTH) {
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

  if (event.message.length > MAX_MESSAGE_LENGTH) {
    return false;
  }

  if (typeof event.environment !== 'string') {
    return false;
  }

  if (event.environment.length > MAX_ENVIRONMENT_LENGTH) {
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