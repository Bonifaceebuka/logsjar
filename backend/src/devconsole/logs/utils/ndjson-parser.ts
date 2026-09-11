import { AppError } from '@/common/errors/appError';
import { Request } from 'express';

export async function* parseNDJSON(
  req: Request,
): AsyncGenerator<unknown> {
  let buffer = '';

  for await (const chunk of req) {
    buffer += chunk.toString('utf8');

    let newlineIndex: number;

    while (
      (newlineIndex = buffer.indexOf('\n')) !== -1
    ) {
      const line = buffer
        .slice(0, newlineIndex)
        .trim();

      buffer = buffer.slice(newlineIndex + 1);

      if (!line) {
        continue;
      }

      try {
        yield JSON.parse(line);
      } catch {
        throw new AppError(
          'Invalid NDJSON record',
        );
      }
    }
  }

  const finalLine = buffer.trim();

  if (finalLine) {
    try {
      yield JSON.parse(finalLine);
    } catch {
      throw new AppError(
        'Invalid NDJSON record',
      );
    }
  }
}