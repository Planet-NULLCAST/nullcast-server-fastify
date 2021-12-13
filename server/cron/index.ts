import { sendMailForSubscribers } from './subscribe-newsletter.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cron = require('node-cron');

export async function runJobs() {
  cron.schedule('0 6 * * 1', () => sendMailForSubscribers());
}

runJobs();

