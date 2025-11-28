import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './DB';

// Global flag to ensure migrations only run once per server instance
let migrationsRun = false;

/**
 * Run pending database migrations at application startup.
 * This is used for production deployments (e.g., Vercel) where migrations
 * cannot run during the build phase.
 *
 * Local development uses PGLite with automatic migrations via the db-server,
 * so this handler is not needed for local dev.
 */
export async function runMigrations(): Promise<void> {
  // Skip if already ran in this server instance
  if (migrationsRun) {
    return;
  }

  // Mark as running to prevent concurrent execution
  migrationsRun = true;

  try {
    console.info('[Migrations] Starting database migrations...');

    // Run migrations from the migrations folder
    await migrate(db, {
      migrationsFolder: 'drizzle',
    });

    console.info('[Migrations] Database migrations completed successfully');
  } catch (error) {
    console.error('[Migrations] Failed to run migrations:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Log warning but don't crash the app - migrations may have already run
    // or the database connection issue may be temporary
    console.warn(
      '[Migrations] App will continue despite migration error. '
      + 'Check your database connection and manually run migrations if needed.',
    );
  }
}
