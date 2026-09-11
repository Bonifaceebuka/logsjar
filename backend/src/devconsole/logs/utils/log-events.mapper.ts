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

    const extras = {
        ...(extra !== undefined ? { extra } : {}),
        ...(Object.keys(otherDataSent).length > 0
        ? { others: otherDataSent }
        : {}),
    };

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
    extras: Object.keys(extras).length === 0 ? null: extras,
    context,
    release,
  };
}