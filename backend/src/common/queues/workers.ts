import { Worker } from 'bullmq';
import { sendEmail } from '@common/utils/mailing';
import { getRedisWorkerClient } from '@common/configs/redis';

interface EmailJobData {
  to: string;
  subject: string;
  html: string;
}

export const emailWorker = new Worker<EmailJobData>(
  'emailQueue',
  async (job) => {
    const {
        emailData,
        queue_name
    } = job.data as any;
    let data;

    switch (queue_name) {
        case 'send-account-activation-email':
            const  {
                  otp,
                  email,
                  first_name,
                  subject,
                  verification_link
              } = emailData as any;

              data = {
                  otp, 
                  email, 
                  first_name,
                  verification_link
              }
              await sendEmail(email, subject, queue_name, data)
              break;
        case 'send-welcome-email':
             const {
                email: welcomeEmail,
                subject: welcomeSubject,
                first_name: welcomeFirstname,
            } = emailData as any;

             data = {
                email: welcomeEmail,
                first_name: welcomeFirstname,
            }
            await sendEmail(welcomeEmail, welcomeSubject, queue_name, data)
            break;
          case 'send-password-reset-request-email':
            const {
              email: resetEmail,
              subject: resetSubject,
              first_name: resetFirstname,
              reset_link,
            } = emailData as any;

            const resetData = {
              email: resetEmail,
              first_name: resetFirstname,
              reset_link,
            };
            await sendEmail(resetEmail, resetSubject, queue_name, resetData)
            break;
          case 'send-password-reset-confirmation-email':
            const {
              email: confEmail,
              subject: confSubject,
              first_name: confFirstname,
              login_link: contact_link,
            } = emailData as any;

            const confirmationData = {
              email: confEmail,
              login_link: contact_link,
              first_name: confFirstname,
            };
            await sendEmail(
              confEmail,
              confSubject,
              queue_name,
              confirmationData
            );
          break;
        default:
            console.warn(`⚠️ Unknown queue_name: ${queue_name}`);
            break;
    }
    
  },
  {
    connection: getRedisWorkerClient()
  }
);

emailWorker.on('completed', (job) => {
  console.log(`✅ Email job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`❌ Email job ${job?.id} failed:`, err);
});