import { CONFIGS } from "../../configs";
import { logger } from "../../configs/logger";
import { emailQueue } from "../Queues";

export const sendAccountActivationEmail = async (emailData: any) => {
  try {
    await emailQueue.add('send-account-activation-email', {
      queue_name: 'send-account-activation-email',
      emailData: {
        ...emailData,
        subject: `${CONFIGS.APP_NAME} Account Activation!`
      },
    });
    logger.debug("Account activation email added to the queue")
  } catch (error) {
    logger.error(`Failed to add Account activation email to the queue: ${error}`)
  }
};

export const sendWelcomeEmail = async (emailData: any) => {
  try {
    await emailQueue.add('send-welcome-email', {
      queue_name: 'send-welcome-email',
      emailData: {
        ...emailData,
        subject: `Welcome to ${CONFIGS.APP_NAME}!`
      },
    });
    logger.debug("Welcome email added to the queue")
  } catch (error) {
    logger.error(`Failed to add Welcome email to the queue: ${error}`)
  }
};

export const sendPasswordResetRequestEmail = async (emailData: any) => {
  try {
    await emailQueue.add("send-password-reset-request-email", {
      queue_name: "send-password-reset-request-email",
      emailData: {
        ...emailData,
        subject: `${CONFIGS.APP_NAME} Password Reset Request`,
      },
    });
    logger.debug("Password reset request email added to the queue")
  } catch (error) {
    logger.error(`Failed to add Password reset request email to the queue: ${error}`)
  }
};

export const sendPasswordResetConfirmationEmail = async (emailData: any) => {
  try {
    await emailQueue.add("send-password-reset-confirmation-email", {
      queue_name: "send-password-reset-confirmation-email",
      emailData: {
        ...emailData,
        subject: `${CONFIGS.APP_NAME} Password Reset Confirmation`,
      },
    });
    logger.debug("Password reset confirmation email added to the queue")
  } catch (error) {
    logger.error(`Failed to add Password reset confirmation email to the queue: ${error}`)
  }
};
