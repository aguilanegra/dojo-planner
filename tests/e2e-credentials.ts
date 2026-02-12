import fs from 'node:fs';
import path from 'node:path';

const CREDENTIALS_PATH = path.join(process.cwd(), '.playwright', 'e2e-credentials.json');

type E2ECredentials = { username: string; password: string };

export function writeCredentials(credentials: E2ECredentials): void {
  fs.mkdirSync(path.dirname(CREDENTIALS_PATH), { recursive: true });
  fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(credentials, null, 2));
}

export function readCredentials(): E2ECredentials {
  const raw = fs.readFileSync(CREDENTIALS_PATH, 'utf-8');
  return JSON.parse(raw) as E2ECredentials;
}

export function cleanupCredentials(): void {
  if (fs.existsSync(CREDENTIALS_PATH)) {
    fs.unlinkSync(CREDENTIALS_PATH);
  }
}
