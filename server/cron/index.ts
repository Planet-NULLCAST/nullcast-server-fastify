import { addHistoricalPoints } from './add-historical-points';
import { sendMailForSubscribers } from './subscribe-newsletter.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cron = require('node-cron');

export async function runJobs() {
  cron.schedule('0 10 * * 1', () => sendMailForSubscribers());
  cron.schedule('0 0 1 * *', () => addHistoricalPoints());
}

runJobs();

