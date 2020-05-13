import sendGrid from '@sendgrid/mail';
import mailgen from 'mailgen';
import dotenv from 'dotenv';

dotenv.config();

const template = new mailgen({
  theme: 'salted',
  product: {
    name: 'Barefoot Nomad',
    link: '#'
  }
});

const generateEmail = (name, introduction, instructions, buttonTxt, link) => ({
  body: {
    name,
    introduction,
    action: {
      instructions,
      button: {
        color: '#33b5e5',
        text: buttonTxt,
        link
      }
    },
    outro: 'Enjoy Barefoot Nomad Services.'
  }
});

const generateNotificationEmail = (name) => ({
  body: {
    name,
    outro: 'Enjoy Barefoot Nomad Services.'
  }
});

export const sendVerificationEmail = async (info) => {
  const emailBody = generateEmail(
    info.name,
    'Welcome to Barefoot Nomad',
    'Please verify your account to start enjoying our services',
    'Verify account',
    `http://${process.env.VERIFY_HOST}/api/v1/auth/verify/${info.token}`
  );
  const emailTemplate = template.generate(emailBody);

  const message = {
    to: `${info.email}`,
    from: 'barefoot@noreply',
    subject: 'Barefoot Nomad Confirmation email',
    text: `${info.name} Welcome to Barefoot Nomad, please verify your account`,
    html: emailTemplate
  };

  sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

  await sendGrid.send(message);
};

export const sendNotificationEmail = async (name, email, role) => {
  const emailBody = generateNotificationEmail(
    `${name} Your Role was upgraded to ${role}`
  );
  const emailTemplate = template.generate(emailBody);

  const message = {
    to: `${email}`,
    from: 'barefoot@noreply',
    subject: 'Barefoot Nomad Role Upgrade',
    html: emailTemplate
  };

  sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

  await sendGrid.send(message);
};
export const sendPasswordResetLink = async (user, host) => {
  const emailBody = generateEmail(
    user.name,
    'Sequel to your request for resetting your password',
    'We have sent you a link to help you out',
    'Click the link below to verify your password',
    `${host}/reset-password`
  );

  // Generate an HTML email with the provided contents
  const emailTemplate = template.generate(emailBody);

  const message = {
    to: `${user.email}`,
    from: 'barefoot@noreply',
    subject: 'Barefoot Nomad Password Reset',
    text: `Hello, ${user.name}.`,
    html: emailTemplate
  };

  sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

  await sendGrid.send(message);
};

/**
 *
 * @param {*} manager
 * @param {*} requester
 * @param {*} recieverEmail
 * @param {*} body
 */
export const emailTripRequest = async (recieverEmail, body, requestId, host) => {
  const emailBody = generateEmail(
    '',
    '',
    '',
    'Click the link here to find the request',
    `http://${host}/api/v1/trips/${requestId}`
  );
  // Generate an HTML email with the provided contents
  const emailTemplate = template.generate(emailBody);
  const message = {
    to: `${recieverEmail}`,
    from: 'barefoot@noreply',
    subject: 'New trip request notification',
    text: `Hello, ${manager}!`,
    html: emailTemplate
  };

  sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

  await sendGrid.send(message);
};
