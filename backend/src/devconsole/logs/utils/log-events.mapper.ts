import { LogLevel } from '../enums/logs.enums';
import { LogsModel } from '../models/logs.model';
import { IncomingLogEvent } from '../types/logs.type';

export function mapLogEventToEntity(
  event: IncomingLogEvent,
  user_id: number,
  api_key_id: number,
): Partial<LogsModel> {
  const { 
      type, 
      level, 
      message: logMessage, 
      exception, 
      environment, 
      service, 
      timestamp,
      extra,
      context,
      release,
      ...otherDataSent 
    } = event;

//   const user =
//     typeof context.user === 'object' &&
//     context.user !== null &&
//     !Array.isArray(context.user)
//       ? context.user as Record<string, unknown>
//       : undefined;

//   const tags =
//     typeof context.tags === 'object' &&
//     context.tags !== null &&
//     !Array.isArray(context.tags)
//       ? context.tags as Record<string, unknown>
//       : undefined;

  return {
    type, 
    level: level as any, 
    message: logMessage, 
    exception, 
    environment, 
    service, 
    timestamp,
    api_key_id,
    user_id,
    extras:{
        extra,
        others: {...otherDataSent} 
    },
    context,
    release,

  };
}