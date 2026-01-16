import type { AsyncSink } from '@logtape/logtape';
import { configure, fromAsyncSink, getConsoleSink, getJsonLinesFormatter, getLogger } from '@logtape/logtape';
import { Env } from './Env';

const betterStackSink: AsyncSink = async (record) => {
  await fetch(`https://${Env.NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Env.NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN}`,
    },
    body: JSON.stringify(record),
  });
};

// Determine which sinks to use based on environment configuration
const remoteSinks = Env.NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN && Env.NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST
  ? ['console', 'betterStack']
  : ['console'];

await configure({
  sinks: {
    console: getConsoleSink({ formatter: getJsonLinesFormatter() }),
    betterStack: fromAsyncSink(betterStackSink),
  },
  loggers: [
    { category: ['logtape', 'meta'], sinks: ['console'], lowestLevel: 'warning' },
    {
      category: ['app'],
      sinks: remoteSinks,
      lowestLevel: 'debug',
    },
    // SOC2 Audit Logger - separate category for compliance audit trails
    // Logs all security-relevant events: authentication, authorization, data mutations
    {
      category: ['audit'],
      sinks: remoteSinks,
      lowestLevel: 'info',
    },
  ],
});

/** General application logger */
export const logger = getLogger(['app']);

/**
 * SOC2 Audit logger for compliance tracking.
 * Use for logging security-relevant events:
 * - Authentication events (login, logout, failed attempts)
 * - Authorization changes (role assignments)
 * - Data mutations (create, update, delete operations)
 * - Administrative actions
 */
export const auditLogger = getLogger(['audit']);
