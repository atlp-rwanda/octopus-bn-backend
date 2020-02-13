import sendGrid from '@sendgrid/mail';
import mailgen from 'mailgen';

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

const sendVerificationEmail = async (info) => {
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

export default sendVerificationEmail;
